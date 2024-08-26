import { contentLength } from "@/lib/content-length"
import { insertPaste } from "@/lib/database/insert"
import { getExpiresAt } from "@/lib/date"
import { env } from "@/lib/env.mjs"
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

	const pasteSyntax = await getPasteSyntax({
		encrypted: false,
		syntax: undefined,
		contentType: "auto",
		content: pasteContent
	})

	return insertPaste({
		content: Buffer.from(pasteContent),
		syntax: pasteSyntax,
		link: false,
		oneTime: false,
		ivClientBase64: undefined,
		ivServer: null,
		expiresAt: getExpiresAt("1-day").toISOString()
	}).match(
		(insertedPaste) => {
			const pasteUrl = buildPasteUrl({
				id: insertedPaste.id
			})

			return new Response(`${pasteUrl}\n`, {
				headers: {
					"content-type": "text/plain"
				}
			})
		},
		(error) => new NextResponse(error, { status: 500 })
	)
}
