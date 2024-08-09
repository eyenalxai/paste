import { db } from "@/lib/database"
import { type PasteInsert, pastes } from "@/lib/schema"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
	const pasteContent: PasteInsert = await request.json()

	await db.insert(pastes).values(pasteContent)

	return NextResponse.json({ success: true })
}
