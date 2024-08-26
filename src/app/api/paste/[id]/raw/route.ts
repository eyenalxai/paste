import { db } from "@/lib/database/client"
import { deleteExpirePastes } from "@/lib/database/delete"
import { getPaste } from "@/lib/database/select"
import { pastes } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export type RawPastePageProps = {
	params: {
		id: string
	}
}

export const GET = async (_request: Request, { params: { id } }: RawPastePageProps) => {
	await deleteExpirePastes()

	if (!id) return new NextResponse("id is required", { status: 400 })

	const paste = await getPaste(id)

	if (!paste) return new NextResponse("paste not found", { status: 404 })

	if (paste.oneTime) {
		await db.delete(pastes).where(eq(pastes.id, id))
	}

	if (!paste.ivClientBase64) return new NextResponse(paste.content.toString("utf-8"), { status: 200 })

	return new NextResponse("paste is encrypted", { status: 400 })
}
