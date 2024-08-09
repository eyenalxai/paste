"use client"

import type { Paste, PasteInsert } from "@/lib/schema"
import ky from "ky"

export const savePaste = (paste: PasteInsert) =>
	ky.post("/api/paste", {
		json: paste
	})

export const getPaste = (uuid: string) =>
	ky
		.get("/api/paste", {
			searchParams: { uuid }
		})
		.json<Paste>()
