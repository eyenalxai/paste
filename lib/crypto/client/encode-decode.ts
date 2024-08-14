"use client"

export const clientKeyToBase64 = async (key: CryptoKey): Promise<string> => {
	const exportedKey = await window.crypto.subtle.exportKey("raw", key)
	return clientArrayBufferToBase64(exportedKey)
}

export const clientArrayBufferToBase64 = (buffer: ArrayBuffer): string =>
	window.btoa(new Uint8Array(buffer).reduce((acc, byte) => acc + String.fromCharCode(byte), ""))

export const clientBase64ToArrayBuffer = (base64: string): ArrayBuffer =>
	Uint8Array.from(window.atob(base64), (c) => c.charCodeAt(0)).buffer
