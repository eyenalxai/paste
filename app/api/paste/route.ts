import { db } from "@/lib/database"
import { getExpiresAt } from "@/lib/date"
import { detectContentLanguage } from "@/lib/detect-language"
import { SecurePasteFormSchema } from "@/lib/form"
import { pastes } from "@/lib/schema"
import { NextResponse } from "next/server"
import type { z } from "zod"

export const POST = async (request: Request) => {
	const receivedPaste: z.infer<typeof SecurePasteFormSchema> = await request.json()

	const pasteValidated = SecurePasteFormSchema.parse(receivedPaste)

	const [paste] = await db
		.insert(pastes)
		.values({
			content: pasteValidated.content,
			language: pasteValidated.iv ? undefined : detectContentLanguage({ content: pasteValidated.content }),
			ivBase64: pasteValidated.iv,
			oneTime: pasteValidated.oneTime,
			expiresAt: getExpiresAt(pasteValidated.expiresAfter).toISOString()
		})
		.returning()

	return NextResponse.json(paste)
}
