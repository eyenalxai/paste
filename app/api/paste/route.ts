import { db } from "@/lib/database"
import { pastes } from "@/lib/schema"
import type { PasteContent } from "@/lib/types"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
	const pasteContent: PasteContent = await request.json()

	await db.insert(pastes).values({
		pasteContent
	})

	return NextResponse.json({ success: true })
}
