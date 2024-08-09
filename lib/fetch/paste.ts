"use client"

import type { PasteInsert } from "@/lib/schema"
import ky from "ky"

export const savePaste = (paste: PasteInsert) =>
	ky.post("/api/paste", {
		json: paste
	})
