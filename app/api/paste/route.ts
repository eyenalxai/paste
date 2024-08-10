import { db } from "@/lib/database"
import { getExpiresAt } from "@/lib/date"
import { PasteFormSchema } from "@/lib/form"
import { pastes } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import type { z } from "zod"

export const POST = async (request: Request) => {
	const receivedPaste: z.infer<typeof PasteFormSchema> = await request.json()

	const pasteValidated = PasteFormSchema.omit({ encrypted: true }).parse(receivedPaste)

	const [paste] = await db
		.insert(pastes)
		.values({
			content: pasteValidated.content,
			oneTime: pasteValidated.oneTime,
			expiresAt: getExpiresAt(pasteValidated.expiresAfter)
		})
		.returning()

	return NextResponse.json(paste)
}

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url)

	const uuid = searchParams.get("uuid")
	if (!uuid) return new NextResponse("uuid query param is required", { status: 400 })

	const [paste] = await db.select().from(pastes).where(eq(pastes.uuid, uuid))
	if (!paste) return new NextResponse("paste not found", { status: 404 })

	if (paste.oneTime) {
		await db.delete(pastes).where(eq(pastes.uuid, uuid))
	}

	return NextResponse.json(paste)
}
