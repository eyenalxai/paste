"use server"

export const serverKeyToBase64 = async (key: CryptoKey): Promise<string> => {
	const exportedKey = await crypto.subtle.exportKey("raw", key)
	return serverArrayBufferToBase64(exportedKey)
}

export const serverArrayBufferToBase64 = async (buffer: ArrayBuffer) =>
	btoa(String.fromCharCode(...new Uint8Array(buffer)))

export const serverBase64ToArrayBuffer = async (base64: string) =>
	Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer
