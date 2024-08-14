"use client"

export const clientKeyToBase64 = async (key: CryptoKey): Promise<string> => {
	const exportedKey = await window.crypto.subtle.exportKey("raw", key)
	return clientArrayBufferToBase64(exportedKey)
}

export const clientArrayBufferToBase64 = (buffer: ArrayBuffer) =>
	window.btoa(String.fromCharCode(...new Uint8Array(buffer)))

export const clientBase64ToArrayBuffer = (base64: string): ArrayBuffer =>
	Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer
