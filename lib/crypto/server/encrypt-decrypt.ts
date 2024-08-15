"use server"

import { KEY_USAGES } from "@/lib/crypto/key"
import {
	serverArrayBufferToBuffer,
	serverBase64ToArrayBuffer,
	serverBufferToArrayBuffer,
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

	const encryptedBuffer = await serverArrayBufferToBuffer(encryptedData)
	const keyBase64 = await serverKeyToBase64(key)
	const ivServer = await serverArrayBufferToBuffer(iv)

	return {
		keyBase64,
		ivServer,
		encryptedBuffer
	}
}

type DecryptPasteProps = {
	keyBase64: string
	ivServer: Buffer
	encryptedBuffer: Buffer
}

export const serverDecryptPaste = async ({ keyBase64, ivServer, encryptedBuffer }: DecryptPasteProps) => {
	const keyBuffer = await serverBase64ToArrayBuffer(keyBase64)
	const iv = await serverBufferToArrayBuffer(ivServer)

	const key = await crypto.subtle.importKey("raw", keyBuffer, { name: "AES-GCM", length: 256 }, true, KEY_USAGES)

	const encryptedContentArrayBuffer = await serverBufferToArrayBuffer(encryptedBuffer)

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
