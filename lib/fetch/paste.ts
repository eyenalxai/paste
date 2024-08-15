"use client"

import type { BackendSchema } from "@/lib/form"
import ky from "ky"
import { z } from "zod"

export const SavePasteResponseSchema = z.object({
	url: z.string().url()
})

export const insertPaste = (paste: z.infer<typeof BackendSchema>) =>
	ky
		.post("/api/paste", {
			json: paste
		})
		.json<z.infer<typeof SavePasteResponseSchema>>()
