"use client"

import type { SecurePasteFormSchema } from "@/lib/form"
import type { Paste } from "@/lib/schema"
import ky from "ky"
import { z } from "zod"

export const SavePasteResponseSchema = z.object({
	url: z.string().url()
})

export const insertPaste = (paste: z.infer<typeof SecurePasteFormSchema>) =>
	ky
		.post("/api/paste", {
			json: paste
		})
		.json<z.infer<typeof SavePasteResponseSchema>>()
