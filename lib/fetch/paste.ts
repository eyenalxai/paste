"use client"

import type { SecurePasteFormSchema } from "@/lib/form"
import type { Paste } from "@/lib/schema"
import ky from "ky"
import type { z } from "zod"

export const insertPaste = (paste: z.infer<typeof SecurePasteFormSchema>) =>
	ky
		.post("/api/paste", {
			json: paste
		})
		.json<Paste>()

export const fetchPaste = (uuid: string) => ky.get(`/api/paste/${uuid}`).json<Paste>()
