"use client"

import { ResultAsync, errAsync } from "neverthrow"

export const copyToClipboard = (text: string) => {
	if (navigator.clipboard?.writeText === undefined) {
		return errAsync("Clipboard API not available")
	}

	return ResultAsync.fromPromise(navigator.clipboard.writeText(text), (e) =>
		e instanceof Error && e.message !== "" ? e.message : "Failed to copy to clipboard"
	)
}
