import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { PreviewImageContainer } from "@/components/preview-image-container"
import { serverDecryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { getPaste } from "@/lib/database/select"
import { getTitle } from "@/lib/title"
import { ImageResponse } from "next/og"
import { NextResponse } from "next/server"

const size = {
	width: 1200,
	height: 630
}

export type ImagePastePageProps = {
	params: {
		id: string
	}
}

export const GET = async (request: Request, { params: { id } }: ImagePastePageProps) => {
	if (!id) return new NextResponse("id is required", { status: 400 })

	const [paste] = await getPaste(id)

	if (!paste) return new NextResponse("paste not found", { status: 404 })

	if (paste.oneTime) return new NextResponse("image generation for one-time pastes is not supported", { status: 400 })

	const title = getTitle({ paste, uppercase: true })

	const fontData = await readFile(path.join(fileURLToPath(import.meta.url), "../../../public/Roboto-Mono-Regular.woff"))

	if (!paste.ivClientBase64) {
		if (paste.link) {
			const content = paste.content.toString("utf-8")
			return new ImageResponse(<PreviewImageContainer title={title} text={content} />, {
				...size,
				fonts: [
					{
						name: "Roboto Mono",
						data: fontData,
						style: "normal"
					}
				]
			})
		}

		if (!paste.ivServer) throw new Error("Paste is somehow not encrypted at client-side or server-side")

		const { searchParams } = new URL(request.url)
		const key = searchParams.get("key")
		if (!key) return new NextResponse("key is required", { status: 400 })

		const decryptedContent = await serverDecryptPaste({
			keyBase64: key,
			ivServer: paste.ivServer,
			encryptedBuffer: paste.content
		})

		return new ImageResponse(<PreviewImageContainer title={title} text={decryptedContent} />, {
			...size,
			fonts: [
				{
					name: "Roboto Mono",
					data: fontData,
					style: "normal"
				}
			]
		})
	}

	const clientEncryptedContent = paste.content.toString("utf-8")

	return new ImageResponse(<PreviewImageContainer title={title} text={clientEncryptedContent} />, {
		...size,
		fonts: [
			{
				name: "Roboto Mono",
				data: fontData,
				style: "normal"
			}
		]
	})
}
