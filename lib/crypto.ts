"use client"

const generateKey = async () =>
	window.crypto.subtle.generateKey(
		{
			name: "AES-GCM",
			length: 256
		},
		true,
		["encrypt", "decrypt"]
	)

const encryptData = async (secretData: string, key: CryptoKey) => {
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

const decryptData = async (encryptedData: ArrayBuffer, iv: Uint8Array, key: CryptoKey) => {
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

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
	let binary = ""
	const bytes = new Uint8Array(buffer)
	const len = bytes.byteLength
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i])
	}
	return window.btoa(binary)
}

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
	const binaryString = window.atob(base64)
	const len = binaryString.length
	const bytes = new Uint8Array(len)
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i)
	}
	return bytes.buffer
}

const keyToBase64 = async (key: CryptoKey): Promise<string> => {
	const exportedKey = await window.crypto.subtle.exportKey("raw", key)
	return arrayBufferToBase64(exportedKey)
}

type EncryptPasteContentToBase64Props = {
	pasteContent: string
}

export const encryptPasteContentToBase64 = async ({ pasteContent }: EncryptPasteContentToBase64Props) => {
	const key = await generateKey()
	const { encryptedData, iv } = await encryptData(pasteContent, key)

	const encryptedContentBase64 = arrayBufferToBase64(encryptedData)
	const keyBase64 = keyToBase64(key)
	const ivBase64 = arrayBufferToBase64(iv)

	const encryptedPayload = {
		keyBase64: keyBase64,
		iv: ivBase64
	}

	const jsonEncryptedPayload = JSON.stringify(encryptedPayload)

	return {
		encryptedPayloadBase64: arrayBufferToBase64(new TextEncoder().encode(jsonEncryptedPayload)),
		encryptedContentBase64: encryptedContentBase64
	}
}

export const pasteContentToBase64 = async (pasteContent: string) => {
	return {
		contentBase64: window.btoa(pasteContent)
	}
}

type DecryptDataFromBase64Props = {
	secretDataBase64: string
	key: CryptoKey
}

export const decryptDataFromBase64 = async ({ secretDataBase64, key }: DecryptDataFromBase64Props): Promise<string> => {
	const jsonEncryptedPayload = new TextDecoder().decode(base64ToArrayBuffer(secretDataBase64))
	const encryptedPayload = JSON.parse(jsonEncryptedPayload)

	const encryptedData = base64ToArrayBuffer(encryptedPayload.encryptedData)
	const iv = base64ToArrayBuffer(encryptedPayload.iv)

	return decryptData(encryptedData, new Uint8Array(iv), key)
}
