import { KEY_USAGES, decryptData, encryptData, generateKey } from "@/lib/crypto"
import { arrayBufferToBase64, base64ToArrayBuffer, keyToBase64 } from "@/lib/encode-decode"

export type EncryptedPayload = {
	k: string
	iv: string
}

type EncryptPasteContentToBase64Props = {
	pasteContent: string
}

export const encryptPasteContentToBase64 = async ({ pasteContent }: EncryptPasteContentToBase64Props) => {
	const key = await generateKey()
	const { encryptedData, iv } = await encryptData(pasteContent, key)

	const encryptedContentBase64 = arrayBufferToBase64(encryptedData)
	const keyBase64 = await keyToBase64(key)
	const ivBase64 = arrayBufferToBase64(iv)

	const encryptedPayload = {
		k: keyBase64,
		iv: ivBase64
	} satisfies EncryptedPayload

	const jsonEncryptedPayload = JSON.stringify(encryptedPayload)

	return {
		encryptedPayloadBase64: arrayBufferToBase64(new TextEncoder().encode(jsonEncryptedPayload)),
		encryptedContentBase64: encryptedContentBase64
	}
}

type DecryptPasteContentFromBase64Props = {
	encryptedContentBase64: string
	encryptedPayloadBase64: string
}

export const decryptPasteContentFromBase64 = async ({
	encryptedContentBase64,
	encryptedPayloadBase64
}: DecryptPasteContentFromBase64Props) => {
	const { k: keyBase64, iv: ivBase64 } = JSON.parse(
		new TextDecoder().decode(base64ToArrayBuffer(encryptedPayloadBase64))
	) as EncryptedPayload

	const keyBuffer = base64ToArrayBuffer(keyBase64)
	const iv = base64ToArrayBuffer(ivBase64)

	const key = await window.crypto.subtle.importKey("raw", keyBuffer, { name: "AES-GCM", length: 256 }, true, KEY_USAGES)

	const encryptedContentArrayBuffer = base64ToArrayBuffer(encryptedContentBase64)

	return await decryptData(encryptedContentArrayBuffer, new Uint8Array(iv), key)
}
