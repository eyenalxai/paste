import { Readable } from "node:stream"
import { createGzip } from "node:zlib"
import { db } from "@/lib/database"
import { deleteExpirePastes } from "@/lib/delete"
import { pastes } from "@/lib/schema"
import { getPaste } from "@/lib/select"
import { eq } from "drizzle-orm"
import type { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"

type GetPasteParams = {
	params: {
		id?: string
	}
}

export const GET = async (
	_request: NextApiRequest,
	response: NextApiResponse<Readable>,
	{ params: { id } }: GetPasteParams
) => {
	await deleteExpirePastes()

	if (!id) return new NextResponse("id is required", { status: 400 })

	const [paste] = await getPaste(id)

	if (!paste) return new NextResponse("paste not found", { status: 404 })

	if (paste.oneTime) {
		await db.delete(pastes).where(eq(pastes.id, id))
	}

	const pasteGzipped = Readable.from(JSON.stringify(paste)).pipe(createGzip())
	response.setHeader("Content-Encoding", "gzip")
	return response.json(pasteGzipped)
}