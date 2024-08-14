import { contentLength } from "@/lib/content-length"
import { db } from "@/lib/database"
import { getExpiresAt } from "@/lib/date"
import { SecurePasteFormSchema } from "@/lib/form"
import { pastes } from "@/lib/schema"
import { getPasteSyntax } from "@/lib/syntax"
import { NextResponse } from "next/server"
import type { z } from "zod"

export const maxDuration = 5 // In seconds

export const POST = async (request: Request) => {
	const badContentLengthResponse = await contentLength(request)
	if (badContentLengthResponse) return badContentLengthResponse

	const receivedPaste: z.infer<typeof SecurePasteFormSchema> = await request.json()

	const pasteValidated = SecurePasteFormSchema.parse(receivedPaste)

	const contentTrimmed = pasteValidated.content.trim()

	const pasteSyntax = await getPasteSyntax({
		encrypted: pasteValidated.iv !== undefined,
		syntax: pasteValidated.syntax,
		contentType: pasteValidated.contentType,
		content: contentTrimmed
	})

	const [paste] = await db
		.insert(pastes)
		.values({
			content: contentTrimmed,
			syntax: pasteSyntax,
			ivBase64: pasteValidated.iv,
			oneTime: pasteValidated.oneTime,
			expiresAt: getExpiresAt(pasteValidated.expiresAfter).toISOString(),
			link: pasteValidated.contentType === "link"
		})
		.returning()

	return NextResponse.json(paste)
}
