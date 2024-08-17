import { serverDecryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { env } from "@/lib/env.mjs"
import type { Paste } from "@/lib/schema"
import { getTitle } from "@/lib/title"
import type { Metadata } from "next"

type BuildUrlProps = {
	frontendUrl: string
	id: string
	key?: string
}

const buildPasteUrl = ({ frontendUrl, id, key }: BuildUrlProps) => {
	if (key) return new URL(`${frontendUrl}/${id}?key=${encodeURIComponent(key)}`)
	return new URL(`${frontendUrl}/${id}`)
}

const buildPasteImageUrl = ({ frontendUrl, id, key }: BuildUrlProps) => {
	if (key) return new URL(`/api/paste/${id}/image?key=${encodeURIComponent(key)}`, frontendUrl)
	return new URL(`/api/paste/${id}/image`, frontendUrl)
}

type BuildPasteMetadataObjectProps = {
	frontendUrl: string
	id: string
	title: string
	description?: string
	key?: string
	withImage?: boolean
}

const buildPasteMetadataObject = ({
	frontendUrl,
	id,
	title,
	description,
	key,
	withImage
}: BuildPasteMetadataObjectProps) => {
	return {
		title: title,
		description: description,
		openGraph: {
			title: title,
			description: description,
			url: buildPasteUrl({ frontendUrl, id, key }),
			type: "website",
			images: withImage
				? [
						{
							url: buildPasteImageUrl({ frontendUrl, id, key }),
							width: 1200,
							height: 630,
							alt: title,
							type: "image/png"
						}
					]
				: undefined
		}
	} satisfies Metadata
}

type BuildPasteMetadataProps = {
	id: string
	paste: Paste
	key: string | undefined
}

export const buildPasteMetadata = async ({ id, paste, key }: BuildPasteMetadataProps) => {
	const frontendUrl = env.NEXT_PUBLIC_FRONTEND_URL

	if (!paste) {
		const title = "Paste does not exist or has expired"
		return buildPasteMetadataObject({ frontendUrl, id, title })
	}

	const title = getTitle({ paste })

	if (!paste.ivClientBase64) {
		if (paste.link) return buildPasteMetadataObject({ frontendUrl, id, title, withImage: true })

		if (!paste.ivServer) {
			return buildPasteMetadataObject({ frontendUrl, id, title: "Failed to decrypt paste", withImage: true })
		}

		if (!key) return buildPasteMetadataObject({ frontendUrl, id, title: "Failed to decrypt paste", withImage: true })

		return await serverDecryptPaste({
			keyBase64: key,
			ivServer: paste.ivServer,
			encryptedBuffer: paste.content
		}).match(
			(decryptedContent) => {
				const contentTrimmed = decryptedContent.length > 32 ? `${decryptedContent.slice(0, 32)}...` : decryptedContent
				const description = paste.link ? undefined : contentTrimmed

				return buildPasteMetadataObject({ frontendUrl, id, title, description, key, withImage: true })
			},
			() => buildPasteMetadataObject({ frontendUrl, id, title: "Failed to decrypt paste", withImage: false })
		)
	}

	const description = paste.link ? undefined : "This paste is encrypted and cannot be previewed"

	return buildPasteMetadataObject({ frontendUrl, id, title, description, key, withImage: true })
}
