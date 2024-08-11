export const keyToBase64 = async (key: CryptoKey): Promise<string> => {
	const exportedKey = await window.crypto.subtle.exportKey("raw", key)
	return arrayBufferToBase64(exportedKey)
}

export const arrayBufferToBase64 = (buffer: ArrayBuffer) => window.btoa(String.fromCharCode(...new Uint8Array(buffer)))

export const base64ToArrayBuffer = (base64: string): ArrayBuffer =>
	Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer
