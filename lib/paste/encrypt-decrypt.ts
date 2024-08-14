import { KEY_USAGES, decryptData, encryptData, generateKey } from "@/lib/crypto"
import { arrayBufferToBase64, base64ToArrayBuffer, keyToBase64 } from "@/lib/encode-decode"

type EncryptPasteContentToBase64Props = {
	pasteContent: string
}

export const clientEncryptPaste = async ({ pasteContent }: EncryptPasteContentToBase64Props) => {
	const key = await generateKey()
	const { encryptedData, iv } = await encryptData(pasteContent, key)

	const encryptedContentBase64 = arrayBufferToBase64(encryptedData)
	const keyBase64 = await keyToBase64(key)
	const ivBase64 = arrayBufferToBase64(iv)

	return {
		keyBase64,
		ivBase64,
		encryptedContentBase64
	}
}

type DecryptPasteContentFromBase64Props = {
	keyBase64: string
	ivBase64: string
	encryptedContentBase64: string
}

export const clientDecryptPaste = async ({
	keyBase64,
	ivBase64,
	encryptedContentBase64
}: DecryptPasteContentFromBase64Props) => {
	const keyBuffer = base64ToArrayBuffer(keyBase64)
	const iv = base64ToArrayBuffer(ivBase64)

	const key = await window.crypto.subtle.importKey("raw", keyBuffer, { name: "AES-GCM", length: 256 }, true, KEY_USAGES)

	const encryptedContentArrayBuffer = base64ToArrayBuffer(encryptedContentBase64)

	return await decryptData(encryptedContentArrayBuffer, new Uint8Array(iv), key)
}
