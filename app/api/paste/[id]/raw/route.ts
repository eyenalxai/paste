import { serverDecryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { db } from "@/lib/database"
import { deleteExpirePastes } from "@/lib/delete"
import { pastes } from "@/lib/schema"
import { getPaste } from "@/lib/select"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export type RawPastePageProps = {
	params: {
		id: string
	}
}

export const GET = async (request: Request, { params: { id } }: RawPastePageProps) => {
	await deleteExpirePastes()

	if (!id) return new NextResponse("id is required", { status: 400 })

	const { searchParams } = new URL(request.url)
	const key = searchParams.get("key")

	if (!key) return new NextResponse("key is required", { status: 400 })

	const [paste] = await getPaste(id)

	if (!paste) return new NextResponse("paste not found", { status: 404 })

	if (paste.oneTime) {
		await db.delete(pastes).where(eq(pastes.id, id))
	}

	if (!paste.ivClientBase64) {
		if (!paste.ivServer) throw new Error("Paste is somehow not encrypted at client-side or server-side")

		const decryptedContent = await serverDecryptPaste({
			keyBase64: decodeURIComponent(key),
			ivServer: paste.ivServer,
			encryptedBuffer: paste.content
		})

		return new NextResponse(decryptedContent, { status: 200 })
	}

	return new NextResponse("paste is encrypted", { status: 400 })
}