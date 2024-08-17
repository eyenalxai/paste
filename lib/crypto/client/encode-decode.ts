"use client"

import { Result, ResultAsync } from "neverthrow"

export const clientKeyToBase64 = (key: CryptoKey) => {
	return ResultAsync.fromPromise(
		window.crypto.subtle.exportKey("raw", key).then((exportedKey) => clientArrayBufferToBase64(exportedKey)),
		(e) => (e instanceof Error && e.message !== "" ? e.message : "Failed to export client encryption key")
	).andThen((keyBase64) => keyBase64)
}

export const clientArrayBufferToBase64 = Result.fromThrowable(
	(buffer: ArrayBuffer) =>
		window.btoa(new Uint8Array(buffer).reduce((acc, byte) => acc + String.fromCharCode(byte), "")),
	(e) => (e instanceof Error && e.message !== "" ? e.message : "Failed to encode array buffer to base64")
)

export const clientBase64ToArrayBuffer = Result.fromThrowable(
	(base64: string) => Uint8Array.from(window.atob(base64), (c) => c.charCodeAt(0)).buffer,
	(e) => (e instanceof Error && e.message !== "" ? e.message : "Failed to decode array buffer from base64")
)
