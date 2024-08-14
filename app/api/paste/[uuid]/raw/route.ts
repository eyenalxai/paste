import type { PastePageProps } from "@/app/[uuidWithExt]/page"
import { db } from "@/lib/database"
import { deleteExpirePastes } from "@/lib/delete"
import { pastes } from "@/lib/schema"
import { getDecryptedPaste } from "@/lib/select"
import { extractUuidAndExtension } from "@/lib/uuid-extension"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export type RawPastePageProps = {
	params: {
		uuid: string
	}
}

export const GET = async (request: Request, { params: { uuid } }: RawPastePageProps) => {
	await deleteExpirePastes()
	console.log("uuid", uuid)

	if (!uuid) return new NextResponse("uuid is required", { status: 400 })

	const { searchParams } = new URL(request.url)
	const key = searchParams.get("key")
	console.log("key", key)

	if (!key) return new NextResponse("key is required", { status: 400 })

	const { decryptedContent, paste } = await getDecryptedPaste({ uuid, key })
	if (!paste) return new NextResponse("paste not found", { status: 404 })

	if (paste.ivClientBase64) return new NextResponse("paste is encrypted", { status: 400 })

	if (paste.oneTime) {
		await db.delete(pastes).where(eq(pastes.uuid, uuid))
	}

	return new NextResponse(decryptedContent, { status: 200 })
}
