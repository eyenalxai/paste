import "server-only"
import {
	serverArrayBufferToBuffer,
	serverBase64ToArrayBuffer,
	serverBufferToArrayBuffer,
	serverKeyToBase64
} from "@/lib/crypto/server/encode-decode"
import { getErrorMessage } from "@/lib/error-message"
import { Result, ResultAsync, errAsync, ok } from "neverthrow"

export const serverGenerateKey = () => {
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

export const serverEncryptData = (secretData: string, key: CryptoKey) => {
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

export const serverDecryptData = (encryptedData: ArrayBuffer, iv: Uint8Array, key: CryptoKey) => {
	return ResultAsync.fromPromise(
		crypto.subtle
			.decrypt(
				{
					name: "AES-GCM",
					iv: iv
				},
				key,
				encryptedData
			)
			.then((decryptedData) => new TextDecoder().decode(decryptedData)),
		(e) => (e instanceof Error && e.message !== "" ? e.message : "Failed to decrypt paste data")
	)
}

const serverImportKey = (keyData: BufferSource) => {
	return ResultAsync.fromPromise(
		crypto.subtle.importKey("raw", keyData, { name: "AES-GCM", length: 256 }, true, ["decrypt"]),
		(e) => getErrorMessage(e, "Failed to import decryption key")
	)
}

type DecryptPasteProps = {
	keyBase64: string
	ivServer: Buffer
	encryptedBuffer: Buffer
}

const serverBufferToUint8Array = Result.fromThrowable(
	(buffer: Buffer) => new Uint8Array(buffer),
	(e) => getErrorMessage(e, "Failed to convert buffer to Uint8Array")
)

export const serverDecryptPaste = ({ keyBase64, ivServer, encryptedBuffer }: DecryptPasteProps) => {
	return serverBase64ToArrayBuffer(keyBase64)
		.asyncAndThen((keyBuffer) => serverImportKey(keyBuffer))
		.andThen((key) =>
			serverBufferToUint8Array(ivServer).asyncAndThen((iv) =>
				serverBufferToArrayBuffer(encryptedBuffer).asyncAndThen((encryptedContentArrayBuffer) =>
					serverDecryptData(encryptedContentArrayBuffer, iv, key)
				)
			)
		)
}
