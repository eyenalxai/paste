import "server-only"

import { getErrorMessage } from "@/lib/error-message"
import { Result, ResultAsync } from "neverthrow"

const serverArrayBufferToBuffer = Result.fromThrowable(
	(arrBuffer: ArrayBuffer) => Buffer.from(arrBuffer),
	(e) => getErrorMessage(e, "Failed to convert array buffer to buffer")
)

const serverFileToArrayBuffer = (file: File) =>
	ResultAsync.fromPromise(file.arrayBuffer(), (e) => getErrorMessage(e, "Failed to convert file to array buffer"))

export const serverFileToBuffer = (file: File) =>
	ResultAsync.fromPromise(
		serverFileToArrayBuffer(file).andThen((arrBuffer) => serverArrayBufferToBuffer(arrBuffer)),
		(e) => getErrorMessage(e, "Failed to convert file to buffer")
	).andThen((buffer) => buffer)
