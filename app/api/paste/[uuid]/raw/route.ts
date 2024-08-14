import type { PastePageProps } from "@/app/[uuidWithExt]/page"
import { db } from "@/lib/database"
import { deleteExpirePastes } from "@/lib/delete"
import { pastes } from "@/lib/schema"
import { getDecryptedPaste } from "@/lib/select"
import { extractUuidAndExtension } from "@/lib/uuid-extension"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const GET = async (_request: Request, { params: { uuidWithExt }, searchParams: { key } }: PastePageProps) => {
	await deleteExpirePastes()

	if (!uuidWithExt) return new NextResponse("uuid is required", { status: 400 })
	const [uuid] = extractUuidAndExtension(uuidWithExt)

	const { decryptedContent, paste } = await getDecryptedPaste({ uuid, key })
	if (!paste) return new NextResponse("paste not found", { status: 404 })

	if (paste.ivClientBase64) return new NextResponse("paste is encrypted", { status: 400 })

	if (paste.oneTime) {
		await db.delete(pastes).where(eq(pastes.uuid, uuid))
	}

	return new NextResponse(decryptedContent, { status: 200 })
}
