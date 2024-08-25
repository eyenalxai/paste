import { NextResponse } from "next/server"

export const contentLength = async (request: Request) => {
	const contentLength = request.headers.get("content-length")
	if (!contentLength) return NextResponse.json({ error: "missing content-length header" }, { status: 411 })

	if (Number.parseInt(contentLength) >= 10) {
		return NextResponse.json({ error: `request body size exceeds ${10 / 1024 / 1024} MiB` }, { status: 413 })
	}
}
