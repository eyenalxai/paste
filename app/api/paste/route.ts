import { db } from "@/lib/database"
import { type PasteInsert, pastes } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
	const pasteContent: PasteInsert = await request.json()

	await db.insert(pastes).values(pasteContent)

	return NextResponse.json({ success: true })
}

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url)

	const uuid = searchParams.get("uuid")
	if (!uuid) return new NextResponse("uuid query param is required", { status: 400 })

	const [paste] = await db.select().from(pastes).where(eq(pastes.uuid, uuid))
	if (!paste) return new NextResponse("paste not found", { status: 404 })

	return NextResponse.json(paste)
}
