"use client"

import { type Result, ResultAsync, err, ok } from "neverthrow"

export const clientKeyToBase64 = (key: CryptoKey) => {
	return ResultAsync.fromPromise(
		window.crypto.subtle.exportKey("raw", key).then((exportedKey) => clientArrayBufferToBase64(exportedKey)),
		(e) => (e instanceof Error && e.message !== "" ? e.message : "Failed to export encryption key")
	).andThen((keyBase64) => keyBase64)
}

export const clientArrayBufferToBase64 = (buffer: ArrayBuffer): Result<string, string> => {
	try {
		return ok(window.btoa(new Uint8Array(buffer).reduce((acc, byte) => acc + String.fromCharCode(byte), "")))
	} catch (e) {
		return e instanceof Error && e.message !== "" ? err(e.message) : err("Failed to decode base64")
	}
}

export const clientBase64ToArrayBuffer = (base64: string): Result<ArrayBuffer, string> => {
	try {
		return ok(Uint8Array.from(window.atob(base64), (c) => c.charCodeAt(0)).buffer)
	} catch (e) {
		return e instanceof Error && e.message !== "" ? err(e.message) : err("Failed to decode base64")
	}
}
