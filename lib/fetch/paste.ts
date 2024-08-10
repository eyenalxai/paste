"use client"

import type { PasteFormSchema } from "@/lib/form"
import type { Paste } from "@/lib/schema"
import ky from "ky"
import type { z } from "zod"

export const insertPaste = (paste: Omit<z.infer<typeof PasteFormSchema>, "encrypted">) =>
	ky
		.post("/api/paste", {
			json: paste
		})
		.json<Paste>()

export const getPaste = (uuid: string) =>
	ky
		.get("/api/paste", {
			searchParams: { uuid }
		})
		.json<Paste>()
