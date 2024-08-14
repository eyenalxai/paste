import { env } from "@/lib/env.mjs"
import { NextResponse } from "next/server"

export const contentLength = async (request: Request) => {
	const contentLength = request.headers.get("content-length")
	if (!contentLength) return NextResponse.json({ error: "missing content-length header" }, { status: 411 })

	if (Number.parseInt(contentLength) > env.MAX_PAYLOAD_SIZE) {
		return NextResponse.json({ error: `request body size exceeds ${env.MAX_PAYLOAD_SIZE} bytes` }, { status: 413 })
	}
}
