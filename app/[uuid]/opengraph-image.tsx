import * as fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { PastePageProps } from "@/app/[uuid]/page"
import { getPaste } from "@/lib/select"
import { ImageResponse } from "next/og"

export const dynamic = "force-static"
export const revalidate = false

export const alt = "About Acme"
export const size = {
	width: 1200,
	height: 630
}

export const contentType = "image/png"

export default async function Image({ params: { uuid } }: PastePageProps) {
	const [paste] = await getPaste({ uuid })

	if (!paste || paste.encrypted) return null

	const fontData = await fs.promises.readFile(
		path.join(fileURLToPath(import.meta.url), "../../../public/Roboto-Mono-Regular.woff")
	)

	return new ImageResponse(
		<div
			style={{
				fontSize: "1.5rem",
				fontFamily: "monospace",
				backgroundColor: "#020817",
				color: "#f8fafc",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "flex-start",
				justifyContent: "flex-start",
				padding: "1rem",
				whiteSpace: "pre-wrap"
			}}
		>
			{paste.content.length > 800 ? `${paste.content.slice(0, 800)}...` : paste.content}
		</div>,
		{
			...size,
			fonts: [
				{
					name: "Roboto Mono",
					data: fontData,
					style: "normal"
				}
			]
		}
	)
}
