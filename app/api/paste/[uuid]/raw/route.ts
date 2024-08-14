import { db } from "@/lib/database"
import { pastes } from "@/lib/schema"
import { getPaste } from "@/lib/select"
import { eq, lt } from "drizzle-orm"
import { NextResponse } from "next/server"

type GetPasteParams = {
	params: {
		uuid?: string
	}
}

export const GET = async (_request: Request, { params: { uuid } }: GetPasteParams) => {
	const deleted = await db.delete(pastes).where(lt(pastes.expiresAt, new Date().toISOString())).returning()

	if (deleted.length > 0) {
		console.info(`Deleted ${deleted.length} expired pastes`)
	}

	if (!uuid) return new NextResponse("uuid is required", { status: 400 })

	const [paste] = await getPaste(uuid)
	if (!paste) return new NextResponse("paste not found", { status: 404 })

	if (paste.ivClientBase64) return new NextResponse("paste is encrypted", { status: 400 })

	if (paste.oneTime) {
		await db.delete(pastes).where(eq(pastes.uuid, uuid))
	}

	return new NextResponse(paste.content, { status: 200 })
}
