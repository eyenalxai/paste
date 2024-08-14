import { contentLength } from "@/lib/content-length"
import { serverEncryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { db } from "@/lib/database"
import { getExpiresAt } from "@/lib/date"
import { pastes } from "@/lib/schema"
import { buildPasteUrl } from "@/lib/url"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
	const badContentLengthResponse = await contentLength(request)
	if (badContentLengthResponse) return badContentLengthResponse

	const formData = await request.formData()

	const pasteContent = formData.get("paste") as string | null

	if (!pasteContent) {
		return new NextResponse("paste field must be filled with paste content", { status: 400 })
	}

	const { keyBase64, ivBase64, encryptedContentBase64 } = await serverEncryptPaste(pasteContent)

	const [insertedPaste] = await db
		.insert(pastes)
		.values({
			content: encryptedContentBase64,
			syntax: undefined,
			link: false,
			oneTime: false,
			ivClientBase64: undefined,
			ivServerBase64: ivBase64,
			expiresAt: getExpiresAt("1-day").toISOString()
		})
		.returning()

	const pasteUrl = buildPasteUrl({
		uuid: insertedPaste.uuid,
		keyBase64
	})

	return new Response(`${pasteUrl}\n`, {
		headers: {
			"content-type": "text/plain"
		}
	})
}
