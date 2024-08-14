import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { PastePageProps } from "@/app/[uuidWithExt]/page"
import { getImageTitle } from "@/lib/image"
import { getDecryptedPaste, getPaste } from "@/lib/select"
import { extractUuidAndExtension } from "@/lib/uuid-extension"
import { ImageResponse } from "next/og"

export const dynamic = "force-static"
export const revalidate = false

export const alt = "About Acme"
export const size = {
	width: 1200,
	height: 630
}

export const contentType = "image/png"

export default async function Image({ params: { uuidWithExt }, searchParams: { key } }: PastePageProps) {
	const [uuid] = extractUuidAndExtension(uuidWithExt)
	const { decryptedContent, paste } = await getDecryptedPaste({ uuid, key })

	if (!paste) return null

	const title = getImageTitle(paste)

	const fontData = await readFile(path.join(fileURLToPath(import.meta.url), "../../../public/Roboto-Mono-Regular.woff"))

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
				flexDirection: "column",
				alignItems: "flex-start",
				justifyContent: "flex-start",
				padding: "1rem",
				whiteSpace: "pre-wrap"
			}}
		>
			<div
				style={{
					backgroundImage: "linear-gradient(0deg, #020817 0%, #fff 100%)",
					backgroundClip: "text",
					color: "transparent",
					display: "block"
				}}
			>
				{decryptedContent.length > 1400 ? `${decryptedContent.slice(0, 1400)}...` : decryptedContent}
			</div>
			<div
				style={{
					paddingBottom: "5rem",
					fontSize: "5rem",
					color: "white",
					fontFamily: "sans-serif"
				}}
			>
				{title}
			</div>
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
