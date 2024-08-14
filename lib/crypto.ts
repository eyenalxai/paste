"use client"

import { env } from "@/lib/env.mjs"

export const KEY_USAGES = ["encrypt", "decrypt"] as const

export const generateKey = async () => {
	try {
		return window.crypto.subtle.generateKey(
			{
				name: "AES-GCM",
				length: 256
			},
			true,
			KEY_USAGES
		)
	} catch (error) {
		console.error(error)
		throw new Error("Failed to generate key, probably because connection is not secure")
	}
}

export const encryptData = async (secretData: string, key: CryptoKey) => {
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

export const decryptData = async (encryptedData: ArrayBuffer, iv: Uint8Array, key: CryptoKey) => {
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

export const isCryptoAvailable = () => new URL(env.NEXT_PUBLIC_FRONTEND_URL).protocol === "https:"
