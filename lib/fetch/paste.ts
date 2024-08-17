"use client"

import type { BackendSchema } from "@/lib/zod/form/backend"
import ky, { HTTPError } from "ky"
import { ResultAsync } from "neverthrow"
import { z } from "zod"

export const SavePasteResponseSchema = z.object({
	url: z.string().url()
})

export const savePaste = (paste: z.infer<typeof BackendSchema>) => {
	const formData = new FormData()
	for (const [key, value] of Object.entries(paste)) {
		formData.append(key, typeof value === "boolean" ? value.toString() : value)
	}

	return ResultAsync.fromPromise(
		ky
			.post("/api/paste", {
				body: formData
			})
			.json<z.infer<typeof SavePasteResponseSchema>>(),
		(e: unknown | HTTPError) => {
			if (e instanceof HTTPError) {
				return e.response.text()
			}
			return e instanceof Error && e.message !== "" ? e.message : "Failed to save paste"
		}
	)
}
