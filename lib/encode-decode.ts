export const keyToBase64 = async (key: CryptoKey): Promise<string> => {
	const exportedKey = await window.crypto.subtle.exportKey("raw", key)
	return arrayBufferToBase64(exportedKey)
}

export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
	let binary = ""
	const bytes = new Uint8Array(buffer)
	const len = bytes.byteLength
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i])
	}
	return window.btoa(binary)
}

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
	const binaryString = window.atob(base64)
	const len = binaryString.length
	const bytes = new Uint8Array(len)
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i)
	}
	return bytes.buffer
}
