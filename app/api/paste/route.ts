import { db } from "@/lib/database"
import { getExpiresAt } from "@/lib/date"
import { serverEnv } from "@/lib/env/server"
import { SecurePasteFormSchema } from "@/lib/form"
import { pastes } from "@/lib/schema"
import { getPasteSyntax } from "@/lib/syntax/paste"
import { NextResponse } from "next/server"
import type { z } from "zod"

export const maxDuration = 5 // In seconds

export const POST = async (request: Request) => {
	const receivedPaste: z.infer<typeof SecurePasteFormSchema> = await request.json()

	const jsonBytes = new TextEncoder().encode(JSON.stringify(receivedPaste)).length

	if (jsonBytes > serverEnv.maxPayloadSize) {
		return NextResponse.json({ error: `request body size exceeds ${serverEnv.maxPayloadSize} bytes` }, { status: 413 })
	}

	const pasteValidated = SecurePasteFormSchema.parse(receivedPaste)

	const pasteSyntax = getPasteSyntax({
		encrypted: pasteValidated.iv !== undefined,
		syntax: pasteValidated.syntax,
		contentType: pasteValidated.contentType,
		content: pasteValidated.content
	})

	const [paste] = await db
		.insert(pastes)
		.values({
			content: pasteValidated.content,
			syntax: pasteSyntax,
			ivBase64: pasteValidated.iv,
			oneTime: pasteValidated.oneTime,
			expiresAt: getExpiresAt(pasteValidated.expiresAfter).toISOString(),
			link: pasteValidated.contentType === "link"
		})
		.returning()

	return NextResponse.json(paste)
}
