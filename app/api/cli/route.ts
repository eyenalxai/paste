import { contentLength } from "@/lib/content-length"
import { db } from "@/lib/database"
import { getExpiresAt } from "@/lib/date"
import { env } from "@/lib/env.mjs"
import { pastes } from "@/lib/schema"
import { detectContentSyntax } from "@/lib/syntax/detect"
import { NextResponse } from "next/server"

export const maxDuration = 5 // In seconds

export const POST = async (request: Request) => {
	const badContentLengthResponse = await contentLength(request)
	if (badContentLengthResponse) return badContentLengthResponse

	const formData = await request.formData()

	const pasteContent = formData.get("paste") as string | null

	if (!pasteContent) {
		return new NextResponse("paste field must be filled with paste content", { status: 400 })
	}

	const contentTrimmed = pasteContent

	const [insertedPaste] = await db
		.insert(pastes)
		.values({
			content: contentTrimmed,
			syntax: await detectContentSyntax(contentTrimmed),
			link: false,
			oneTime: false,
			ivClientBase64: undefined,
			expiresAt: getExpiresAt("1-day").toISOString()
		})
		.returning()

	return new Response(`${env.NEXT_PUBLIC_FRONTEND_URL}/${insertedPaste.uuid}\n`, {
		headers: {
			"content-type": "text/plain"
		}
	})
}
