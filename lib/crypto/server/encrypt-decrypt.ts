import "server-only"
import { serverArrayBufferToBuffer, serverKeyToBase64 } from "@/lib/crypto/server/encode-decode"
import { getErrorMessage } from "@/lib/error-message"
import { ResultAsync, errAsync, ok } from "neverthrow"

const serverGenerateKey = () => {
	return ResultAsync.fromPromise(
		crypto.subtle.generateKey(
			{
				name: "AES-GCM",
				length: 256
			},
			true,
			["encrypt"]
		),
		(e) => getErrorMessage(e, "Failed to generate encryption key")
	)
}

const serverEncryptData = (secretData: string, key: CryptoKey) => {
	try {
		const iv = crypto.getRandomValues(new Uint8Array(12))
		const encodedData = new TextEncoder().encode(secretData)

		return ResultAsync.fromPromise(
			crypto.subtle
				.encrypt(
					{
						name: "AES-GCM",
						iv: iv
					},
					key,
					encodedData
				)
				.then((encryptedData) => ({ encryptedData, iv })),
			(e) => getErrorMessage(e, "Failed to encrypt paste data")
		)
	} catch (e) {
		return errAsync(getErrorMessage(e, "An unknown error occurred during encryption setup"))
	}
}

export const serverEncryptPaste = (pasteContent: string) => {
	return serverGenerateKey().andThen((key) =>
		serverEncryptData(pasteContent, key).andThen(({ encryptedData, iv }) =>
			serverArrayBufferToBuffer(encryptedData).asyncAndThen((encryptedBuffer) =>
				serverKeyToBase64(key).andThen((keyBase64) =>
					serverArrayBufferToBuffer(iv).andThen((ivServer) =>
						ok({
							keyBase64,
							ivServer,
							encryptedBuffer
						})
					)
				)
			)
		)
	)
}
