"use client"

import { arrayBufferToBase64, base64ToArrayBuffer, keyToBase64 } from "@/lib/crypto/encode-decode"
import { getErrorMessage } from "@/lib/error-message"
import { ResultAsync, errAsync, ok } from "neverthrow"

const generateKey = () => {
	return ResultAsync.fromPromise(
		window.crypto.subtle.generateKey(
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

const importKey = (keyData: BufferSource) => {
	return ResultAsync.fromPromise(
		window.crypto.subtle.importKey("raw", keyData, { name: "AES-GCM", length: 256 }, true, ["decrypt"]),
		(e) => getErrorMessage(e, "Failed to import encryption key")
	)
}

const encryptData = (secretData: string, key: CryptoKey) => {
	try {
		const iv = window.crypto.getRandomValues(new Uint8Array(12))
		const encodedData = new TextEncoder().encode(secretData)

		return ResultAsync.fromPromise(
			window.crypto.subtle
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

export const encryptPaste = (pasteContent: string) => {
	return generateKey().andThen((key) =>
		encryptData(pasteContent, key).andThen(({ encryptedData, iv }) =>
			arrayBufferToBase64(encryptedData).asyncAndThen((encryptedContentBase64) =>
				keyToBase64(key).andThen((keyBase64) =>
					arrayBufferToBase64(iv).andThen((ivBase64) =>
						ok({
							keyBase64,
							ivBase64,
							encryptedContentBase64
						})
					)
				)
			)
		)
	)
}

const clientDecryptData = (encryptedData: ArrayBuffer, iv: Uint8Array, key: CryptoKey) => {
	return ResultAsync.fromPromise(
		window.crypto.subtle
			.decrypt(
				{
					name: "AES-GCM",
					iv: iv
				},
				key,
				encryptedData
			)
			.then((decryptedData) => new TextDecoder().decode(decryptedData)),
		(e) => getErrorMessage(e, "Failed to decrypt paste data")
	)
}

type DecryptPasteProps = {
	keyBase64: string
	ivBase64: string
	encryptedContentBase64: string
}

export const clientDecryptPaste = ({ keyBase64, ivBase64, encryptedContentBase64 }: DecryptPasteProps) => {
	return base64ToArrayBuffer(keyBase64)
		.asyncAndThen((keyBuffer) => importKey(keyBuffer))
		.andThen((key) =>
			base64ToArrayBuffer(ivBase64).asyncAndThen((ivBuffer) =>
				base64ToArrayBuffer(encryptedContentBase64).asyncAndThen((encryptedContentArrayBuffer) =>
					clientDecryptData(encryptedContentArrayBuffer, new Uint8Array(ivBuffer), key)
				)
			)
		)
}
