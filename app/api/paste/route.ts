import { contentLength } from "@/lib/content-length"
import { serverEncryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { db } from "@/lib/database"
import { getExpiresAt } from "@/lib/date"
import { BackendSchema } from "@/lib/form"
import { pastes } from "@/lib/schema"
import { getPasteSyntax } from "@/lib/syntax/detect"
import { buildPasteUrl } from "@/lib/url"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
	const badContentLengthResponse = await contentLength(request)
	if (badContentLengthResponse) return badContentLengthResponse

	const { ivClient, content, oneTime, expiresAfter, contentType, syntax } = BackendSchema.parse(await request.json())

	const contentTrimmed = content.trim()

	const pasteSyntax = await getPasteSyntax({
		encrypted: ivClient !== undefined,
		syntax: syntax,
		contentType: contentType,
		content: contentTrimmed
	})

	const { keyBase64, ivServer, encryptedBuffer } = await serverEncryptPaste(contentTrimmed)

	const [insertedPaste] = await db
		.insert(pastes)
		.values({
			content: encryptedBuffer,
			syntax: pasteSyntax,
			ivClientBase64: ivClient,
			ivServer: ivServer,
			oneTime: oneTime,
			expiresAt: getExpiresAt(expiresAfter).toISOString(),
			link: contentType === "link"
		})
		.returning()

	return NextResponse.json({
		url: buildPasteUrl({ uuid: insertedPaste.uuid, keyBase64 })
	})
}
