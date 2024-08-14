"use client"

import { arrayBufferToBase64, base64ToArrayBuffer, keyToBase64 } from "@/lib/crypto/client/encode-decode"

export const KEY_USAGES = ["encrypt", "decrypt"] as const

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

export const clientEncryptPaste = async (pasteContent: string) => {
	const key = await clientGenerateKey()
	const { encryptedData, iv } = await clientEncryptData(pasteContent, key)

	const encryptedContentBase64 = arrayBufferToBase64(encryptedData)
	const keyBase64 = await keyToBase64(key)
	const ivBase64 = arrayBufferToBase64(iv)

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

export const clientDecryptPaste = async ({ keyBase64, ivBase64, encryptedContentBase64 }: DecryptPasteProps) => {
	const keyBuffer = base64ToArrayBuffer(keyBase64)
	const iv = base64ToArrayBuffer(ivBase64)

	const key = await window.crypto.subtle.importKey("raw", keyBuffer, { name: "AES-GCM", length: 256 }, true, KEY_USAGES)

	const encryptedContentArrayBuffer = base64ToArrayBuffer(encryptedContentBase64)

	return await clientDecryptData(encryptedContentArrayBuffer, new Uint8Array(iv), key)
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

export const clientDecryptData = async (encryptedData: ArrayBuffer, iv: Uint8Array, key: CryptoKey) => {
	const decryptedData = await window.crypto.subtle.decrypt(
		{
			name: "AES-GCM",
			iv: iv
		},
		key,
		encryptedData
	)

	return new TextDecoder().decode(decryptedData)
}
