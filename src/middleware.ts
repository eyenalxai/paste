import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
	if (request.headers.get("content-type")?.includes("multipart/form-data")) {
		return NextResponse.rewrite(new URL("/api/cli", request.url))
	}
}

export const config = {
	matcher: "/"
}
