import { contentLength } from "@/lib/content-length"
import { serverEncryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { db } from "@/lib/database"
import { getExpiresAt } from "@/lib/date"
import { env } from "@/lib/env.mjs"
import { pastes } from "@/lib/schema"
import { getPasteSyntax } from "@/lib/syntax/detect"
import { buildPasteUrl } from "@/lib/url"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
	if (env.NEXT_PUBLIC_CLIENT_SIDE_ENCRYPTION_ONLY) {
		return new NextResponse("Server-side encryption is disabled", { status: 400 })
	}

	const badContentLengthResponse = await contentLength(request)
	if (badContentLengthResponse) return badContentLengthResponse

	const formData = await request.formData()

	const pasteContent = formData.get("paste")

	if (!pasteContent) {
		return new NextResponse("paste field must be filled with paste content", { status: 400 })
	}

	if (typeof pasteContent !== "string") {
		return new NextResponse("paste field must be a string", { status: 400 })
	}

	const { keyBase64, ivServer, encryptedBuffer } = await serverEncryptPaste(pasteContent)

	const pasteSyntax = await getPasteSyntax({
		encrypted: false,
		syntax: undefined,
		contentType: "auto",
		content: pasteContent
	})

	const [insertedPaste] = await db
		.insert(pastes)
		.values({
			content: encryptedBuffer,
			syntax: "plaintext",
			link: false,
			oneTime: false,
			ivClientBase64: undefined,
			ivServer: ivServer,
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
