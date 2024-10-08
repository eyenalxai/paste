"use client"

import { getErrorMessage } from "@/lib/error-message"
import { Result, ResultAsync } from "neverthrow"

export const keyToBase64 = (key: CryptoKey) => {
	return ResultAsync.fromPromise(
		window.crypto.subtle.exportKey("raw", key).then((exportedKey) => arrayBufferToBase64(exportedKey)),
		(e) => getErrorMessage(e, "Failed to export client encryption key")
	).andThen((keyBase64) => keyBase64)
}

export const arrayBufferToBase64 = Result.fromThrowable(
	(buffer: ArrayBuffer) =>
		window.btoa(new Uint8Array(buffer).reduce((acc, byte) => acc + String.fromCharCode(byte), "")),
	(e) => getErrorMessage(e, "Failed to encode array buffer to base64")
)

export const base64ToArrayBuffer = Result.fromThrowable(
	(base64: string) => Uint8Array.from(window.atob(base64), (c) => c.charCodeAt(0)).buffer,
	(e) => getErrorMessage(e, "Failed to decode array buffer from base64")
)
