"use client"

import type { Paste, PasteInsert } from "@/lib/schema"
import ky from "ky"

export const insertPaste = (paste: PasteInsert) =>
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
