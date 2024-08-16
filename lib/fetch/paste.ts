"use client"

import type { BackendSchema } from "@/lib/form"
import ky from "ky"
import { z } from "zod"

export const SavePasteResponseSchema = z.object({
	url: z.string().url()
})

export const savePaste = (paste: z.infer<typeof BackendSchema>) => {
	const formData = new FormData()
	for (const [key, value] of Object.entries(paste)) {
		formData.append(key, typeof value === "boolean" ? value.toString() : value)
	}

	return ky
		.post("/api/paste", {
			body: formData
		})
		.json<z.infer<typeof SavePasteResponseSchema>>()
}
