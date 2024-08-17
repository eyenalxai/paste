"use client"

import {
	clientArrayBufferToBase64,
	clientBase64ToArrayBuffer,
	clientKeyToBase64
} from "@/lib/crypto/client/encode-decode"
import { KEY_USAGES } from "@/lib/crypto/key"
import { ResultAsync } from "neverthrow"

export const clientGenerateKey = async () => {
	return window.crypto.subtle.generateKey(
		{
			name: "AES-GCM",
			length: 256
		},
		true,
		KEY_USAGES
	)
}

const clientImportKey = (keyData: BufferSource) => {
	return ResultAsync.fromPromise(
		window.crypto.subtle.importKey("raw", keyData, { name: "AES-GCM", length: 256 }, true, KEY_USAGES),
		(e) => (e instanceof Error ? e.message : "Failed to import key")
	)
}

export const clientEncryptPaste = async (pasteContent: string) => {
	const key = await clientGenerateKey()
	const { encryptedData, iv } = await clientEncryptData(pasteContent, key)

	const encryptedContentBase64 = clientArrayBufferToBase64(encryptedData)
	const keyBase64 = await clientKeyToBase64(key)
	const ivBase64 = clientArrayBufferToBase64(iv)

	return {
		keyBase64,
		ivBase64,
		encryptedContentBase64
	}
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

export const clientEncryptData = async (secretData: string, key: CryptoKey) => {
	const iv = window.crypto.getRandomValues(new Uint8Array(12))
	const encodedData = new TextEncoder().encode(secretData)

	const encryptedData = await window.crypto.subtle.encrypt(
		{
			name: "AES-GCM",
			iv: iv
		},
		key,
		encodedData
	)

	return {
		encryptedData,
		iv
	}
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
		(e) => (e instanceof Error && e.message !== "" ? e.message : "Failed to decrypt paste data")
	)
}
