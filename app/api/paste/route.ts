import { db } from "@/lib/database"
import { getExpiresAt } from "@/lib/date"
import { detectContentLanguage } from "@/lib/detect-language"
import { PasteFormSchema } from "@/lib/form"
import { pastes } from "@/lib/schema"
import { getPaste } from "@/lib/select"
import { eq, lt } from "drizzle-orm"
import { NextResponse } from "next/server"
import type { z } from "zod"

export const POST = async (request: Request) => {
	const receivedPaste: z.infer<typeof PasteFormSchema> = await request.json()

	const pasteValidated = PasteFormSchema.parse(receivedPaste)

	const [paste] = await db
		.insert(pastes)
		.values({
			content: pasteValidated.content,
			language: pasteValidated.encrypted ? undefined : detectContentLanguage({ content: pasteValidated.content }),
			encrypted: pasteValidated.encrypted,
			oneTime: pasteValidated.oneTime,
			expiresAt: getExpiresAt(pasteValidated.expiresAfter).toISOString()
		})
		.returning()

	return NextResponse.json(paste)
}

export const GET = async (request: Request) => {
	const deleted = await db.delete(pastes).where(lt(pastes.expiresAt, new Date().toISOString())).returning()

	if (deleted.length > 0) {
		console.log(`Deleted ${deleted.length} expired pastes`)
	}

	const { searchParams } = new URL(request.url)

	const uuid = searchParams.get("uuid")
	if (!uuid) return new NextResponse("uuid query param is required", { status: 400 })

	const [paste] = await getPaste({ uuid })
	if (!paste) return new NextResponse("paste not found", { status: 404 })

	if (paste.oneTime) {
		await db.delete(pastes).where(eq(pastes.uuid, uuid))
	}

	return NextResponse.json(paste)
}
