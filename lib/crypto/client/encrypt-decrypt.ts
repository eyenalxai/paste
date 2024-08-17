"use client"

import {
	clientArrayBufferToBase64,
	clientBase64ToArrayBuffer,
	clientKeyToBase64
} from "@/lib/crypto/client/encode-decode"
import { KEY_USAGES } from "@/lib/crypto/key"
import { getErrorMessage } from "@/lib/error-message"
import { ResultAsync, errAsync, ok } from "neverthrow"

export const clientGenerateKey = () => {
	return ResultAsync.fromPromise(
		window.crypto.subtle.generateKey(
			{
				name: "AES-GCM",
				length: 256
			},
			true,
			KEY_USAGES
		),
		(e) => getErrorMessage(e, "Failed to generate encryption key")
	)
}

const clientImportKey = (keyData: BufferSource) => {
	return ResultAsync.fromPromise(
		window.crypto.subtle.importKey("raw", keyData, { name: "AES-GCM", length: 256 }, true, KEY_USAGES),
		(e) => getErrorMessage(e, "Failed to import encryption key")
	)
}

export const clientEncryptData = (secretData: string, key: CryptoKey) => {
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

export const clientEncryptPaste = (pasteContent: string) => {
	return clientGenerateKey().andThen((key) =>
		clientEncryptData(pasteContent, key).andThen(({ encryptedData, iv }) =>
			clientArrayBufferToBase64(encryptedData).asyncAndThen((encryptedContentBase64) =>
				clientKeyToBase64(key).andThen((keyBase64) =>
					clientArrayBufferToBase64(iv).andThen((ivBase64) =>
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

export const clientDecryptData = (encryptedData: ArrayBuffer, iv: Uint8Array, key: CryptoKey) => {
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
	return clientBase64ToArrayBuffer(keyBase64)
		.asyncAndThen((keyBuffer) => clientImportKey(keyBuffer))
		.andThen((key) =>
			clientBase64ToArrayBuffer(ivBase64).asyncAndThen((ivBuffer) =>
				clientBase64ToArrayBuffer(encryptedContentBase64).asyncAndThen((encryptedContentArrayBuffer) =>
					clientDecryptData(encryptedContentArrayBuffer, new Uint8Array(ivBuffer), key)
				)
			)
		)
}
