import { db } from "@/lib/database"
import { getExpiresAt } from "@/lib/date"
import { detectContentLanguage } from "@/lib/detect-language"
import { serverEnv } from "@/lib/env/server"
import { SecurePasteFormSchema } from "@/lib/form"
import { pastes } from "@/lib/schema"
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
