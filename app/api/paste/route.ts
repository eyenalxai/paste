import { contentLength } from "@/lib/content-length"
import { serverEncryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { db } from "@/lib/database"
import { getExpiresAt } from "@/lib/date"
import { SecurePasteFormSchema } from "@/lib/form"
import { pastes } from "@/lib/schema"
import { getPasteSyntax } from "@/lib/syntax/detect"
import { buildPasteUrl } from "@/lib/url"
import { NextResponse } from "next/server"
import type { z } from "zod"

export const POST = async (request: Request) => {
	const badContentLengthResponse = await contentLength(request)
	if (badContentLengthResponse) return badContentLengthResponse

	const receivedPaste: z.infer<typeof SecurePasteFormSchema> = await request.json()

	const pasteValidated = SecurePasteFormSchema.parse(receivedPaste)

	const contentTrimmed = pasteValidated.content.trim()

	const pasteSyntax = await getPasteSyntax({
		encrypted: pasteValidated.ivClient !== undefined,
		syntax: pasteValidated.syntax,
		contentType: pasteValidated.contentType,
		content: contentTrimmed
	})

	const { keyBase64, ivBase64, encryptedContentBase64 } = await serverEncryptPaste(contentTrimmed)

	const [insertedPaste] = await db
		.insert(pastes)
		.values({
			content: encryptedContentBase64,
			syntax: pasteSyntax,
			ivClientBase64: pasteValidated.ivClient,
			ivServerBase64: ivBase64,
			oneTime: pasteValidated.oneTime,
			expiresAt: getExpiresAt(pasteValidated.expiresAfter).toISOString(),
			link: pasteValidated.contentType === "link"
		})
		.returning()

	return NextResponse.json({
		url: buildPasteUrl({ uuid: insertedPaste.uuid, keyBase64 })
	})
}
