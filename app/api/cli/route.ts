import { db } from "@/lib/database"
import { getExpiresAt } from "@/lib/date"
import { clientEnv } from "@/lib/env/client"
import { serverEnv } from "@/lib/env/server"
import { pastes } from "@/lib/schema"
import { detectContentSyntax } from "@/lib/syntax/detect-language"
import { NextResponse } from "next/server"

export const maxDuration = 5 // In seconds

export const POST = async (request: Request) => {
	const formData = await request.formData()

	const formDataBytes = [...formData.entries()].reduce(
		(acc, [_key, value]) => acc + new Blob([value.toString()]).size,
		0
	)

	if (formDataBytes > serverEnv.maxPayloadSize) {
		return new NextResponse(`request body size exceeds ${serverEnv.maxPayloadSize} bytes`, { status: 413 })
	}

	const pasteContent = formData.get("paste") as string | null

	if (!pasteContent) {
		return new NextResponse("paste field must be filled with paste content", { status: 400 })
	}

	const [insertedPaste] = await db
		.insert(pastes)
		.values({
			content: pasteContent,
			syntax: detectContentSyntax({ content: pasteContent }),
			link: false,
			oneTime: false,
			ivBase64: undefined,
			expiresAt: getExpiresAt("1-day").toISOString()
		})
		.returning()

	return new Response(`${clientEnv.frontendUrl}/${insertedPaste.uuid}\n`, {
		headers: {
			"content-type": "text/plain"
		}
	})
}
