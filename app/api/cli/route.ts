import { db } from "@/lib/database"
import { getExpiresAt } from "@/lib/date"
import { clientEnv } from "@/lib/env/client"
import { pastes } from "@/lib/schema"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
	const formData = await request.formData()

	const pasteContent = formData.get("paste") as string | null

	if (!pasteContent) {
		return new NextResponse("paste field must be filled with paste content", { status: 400 })
	}

	const [insertedPaste] = await db
		.insert(pastes)
		.values({
			content: Buffer.from(pasteContent).toString("base64"),
			oneTime: false,
			expiresAt: getExpiresAt("1-day").toISOString()
		})
		.returning()

	return new Response(`${clientEnv.frontendUrl}/${insertedPaste.uuid}\n`, {
		headers: {
			"content-type": "text/plain"
		}
	})
}