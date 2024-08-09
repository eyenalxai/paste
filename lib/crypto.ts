"use client"

export const generateKey = async () =>
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

type EncryptDataToBase64Props = {
	secretData: string
	key: CryptoKey
}

export const encryptDataToBase64 = async ({ secretData, key }: EncryptDataToBase64Props): Promise<string> => {
	const { encryptedData, iv } = await encryptData(secretData, key)

	const encryptedDataBase64 = arrayBufferToBase64(encryptedData)
	const ivBase64 = arrayBufferToBase64(iv)

	const encryptedPayload = {
		encryptedData: encryptedDataBase64,
		iv: ivBase64
	}

	const jsonEncryptedPayload = JSON.stringify(encryptedPayload)

	return arrayBufferToBase64(new TextEncoder().encode(jsonEncryptedPayload))
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

type SaveEncryptedPasteProps = {
	content: string
	encryptionKey?: CryptoKey
}

export const getPasteContentBase64 = async ({ content, encryptionKey }: SaveEncryptedPasteProps) => {
	return encryptionKey !== undefined
		? await encryptDataToBase64({ secretData: content, key: encryptionKey })
		: window.btoa(content)
}
