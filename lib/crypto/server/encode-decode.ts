import "server-only"

import { getErrorMessage } from "@/lib/error-message"
import { Result, ResultAsync } from "neverthrow"

export const serverKeyToBase64 = (key: CryptoKey) => {
	return ResultAsync.fromPromise(
		crypto.subtle.exportKey("raw", key).then((exportedKey) => serverArrayBufferToBase64(exportedKey)),
		(e) => getErrorMessage(e, "Failed to export server encryption key")
	).andThen((keyBase64) => keyBase64)
}

export const serverArrayBufferToBase64 = Result.fromThrowable(
	(buffer: ArrayBuffer) => btoa(new Uint8Array(buffer).reduce((acc, byte) => acc + String.fromCharCode(byte), "")),
	(e) => getErrorMessage(e, "Failed to encode array buffer to base64")
)

export const serverBase64ToArrayBuffer = Result.fromThrowable(
	(base64: string) => Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer,
	(e) => getErrorMessage(e, "Failed to decode array buffer from base64")
)

export const serverArrayBufferToBuffer = Result.fromThrowable(
	(arrBuffer: ArrayBuffer) => Buffer.from(arrBuffer),
	(e) => getErrorMessage(e, "Failed to convert array buffer to buffer")
)

export const serverBufferToArrayBuffer = Result.fromThrowable(
	(buffer: Buffer) => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
	(e) => getErrorMessage(e, "Failed to convert buffer to array buffer")
)

const serverFileToArrayBuffer = (file: File) =>
	ResultAsync.fromPromise(file.arrayBuffer(), (e) => getErrorMessage(e, "Failed to convert file to array buffer"))

export const serverFileToBuffer = (file: File) =>
	ResultAsync.fromPromise(
		serverFileToArrayBuffer(file).andThen((arrBuffer) => serverArrayBufferToBuffer(arrBuffer)),
		(e) => getErrorMessage(e, "Failed to convert file to buffer")
	).andThen((buffer) => buffer)
