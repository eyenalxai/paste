"use server"

import { KEY_USAGES } from "@/lib/crypto/key"
import {
	serverArrayBufferToBase64,
	serverBase64ToArrayBuffer,
	serverKeyToBase64
} from "@/lib/crypto/server/encode-decode"

export const serverGenerateKey = async () => {
	return crypto.subtle.generateKey(
		{
			name: "AES-GCM",
			length: 256
		},
		true,
		KEY_USAGES
	)
}

export const serverEncryptPaste = async (pasteContent: string) => {
	const key = await serverGenerateKey()
	const { encryptedData, iv } = await serverEncryptData(pasteContent, key)

	const encryptedContentBase64 = await serverArrayBufferToBase64(encryptedData)
	const keyBase64 = await serverKeyToBase64(key)
	const ivBase64 = await serverArrayBufferToBase64(iv)

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

export const serverDecryptPaste = async ({ keyBase64, ivBase64, encryptedContentBase64 }: DecryptPasteProps) => {
	const keyBuffer = await serverBase64ToArrayBuffer(keyBase64)
	const iv = await serverBase64ToArrayBuffer(ivBase64)

	const key = await crypto.subtle.importKey("raw", keyBuffer, { name: "AES-GCM", length: 256 }, true, KEY_USAGES)

	const encryptedContentArrayBuffer = await serverBase64ToArrayBuffer(encryptedContentBase64)

	return await serverDecryptData(encryptedContentArrayBuffer, new Uint8Array(iv), key)
}

export const serverEncryptData = async (secretData: string, key: CryptoKey) => {
	const iv = crypto.getRandomValues(new Uint8Array(12))
	const encodedData = new TextEncoder().encode(secretData)

	const encryptedData = await crypto.subtle.encrypt(
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

export const serverDecryptData = async (encryptedData: ArrayBuffer, iv: Uint8Array, key: CryptoKey) => {
	const decryptedData = await crypto.subtle.decrypt(
		{
			name: "AES-GCM",
			iv: iv
		},
		key,
		encryptedData
	)

	return new TextDecoder().decode(decryptedData)
}
