import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { PastePageProps } from "@/app/[uuidWithExt]/page"
import { PreviewImageContainer } from "@/components/preview-image-container"
import { serverDecryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { getImageTitle } from "@/lib/image"
import { getPaste } from "@/lib/select"
import { extractUuidAndExtension } from "@/lib/uuid-extension"
import { ImageResponse } from "next/og"
import { NextResponse } from "next/server"

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

	const [paste] = await getPaste(uuid)

	if (!paste) return new NextResponse("paste not found", { status: 404 })

	const title = getImageTitle(paste)

	const fontData = await readFile(path.join(fileURLToPath(import.meta.url), "../../../public/Roboto-Mono-Regular.woff"))

	if (!paste.ivClientBase64) {
		if (!paste.ivServer) throw new Error("Paste is somehow not encrypted at client-side or server-side")

		const decryptedContent = await serverDecryptPaste({
			keyBase64: decodeURIComponent(key),
			ivServer: paste.ivServer,
			encryptedBuffer: paste.content
		})

		return new ImageResponse(
			<PreviewImageContainer title={title}>
				{decryptedContent.length > 1400 ? `${decryptedContent.slice(0, 1400)}...` : decryptedContent}
			</PreviewImageContainer>,
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

	const clientEncryptedContent = paste.content.toString("utf-8")

	return new ImageResponse(
		<PreviewImageContainer title={title}>
			{clientEncryptedContent.length > 1400 ? `${clientEncryptedContent.slice(0, 1400)}...` : clientEncryptedContent}
		</PreviewImageContainer>,
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
