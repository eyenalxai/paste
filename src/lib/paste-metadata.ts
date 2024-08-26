import { env } from "@/lib/env.mjs"
import type { Paste } from "@/lib/schema"
import { getTitle } from "@/lib/title"
import type { Metadata } from "next"

type BuildUrlProps = {
	frontendUrl: string
	id: string
}

const buildPasteUrl = ({ frontendUrl, id }: BuildUrlProps) => {
	return new URL(`${frontendUrl}/${id}`)
}

const buildPasteImageUrl = ({ frontendUrl, id }: BuildUrlProps) => {
	return new URL(`/api/paste/${id}/image`, frontendUrl)
}

type BuildPasteMetadataObjectProps = {
	frontendUrl: string
	id: string
	title: string
	description?: string
	withImage?: boolean
}

const buildPasteMetadataObject = ({
	frontendUrl,
	id,
	title,
	description,
	withImage
}: BuildPasteMetadataObjectProps) => {
	return {
		title: title,
		description: description,
		openGraph: {
			title: title,
			description: description,
			url: buildPasteUrl({ frontendUrl, id }),
			type: "website",
			images: withImage
				? [
						{
							url: buildPasteImageUrl({ frontendUrl, id }),
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
}

export const buildPasteMetadata = async ({ id, paste }: BuildPasteMetadataProps) => {
	const frontendUrl = env.NEXT_PUBLIC_FRONTEND_URL

	if (!paste) {
		const title = "Paste does not exist or has expired"
		return buildPasteMetadataObject({ frontendUrl, id, title })
	}

	const title = getTitle({ paste })

	if (paste.oneTime)
		return buildPasteMetadataObject({ frontendUrl, description: "This paste will be deleted after viewing", id, title })

	if (!paste.ivClientBase64) {
		if (paste.link) return buildPasteMetadataObject({ frontendUrl, id, title, withImage: true })

		const content = paste.content.toString("utf-8")

		const contentTrimmed = content.length > 32 ? `${content.slice(0, 32)}...` : content
		const description = paste.link ? undefined : contentTrimmed

		return buildPasteMetadataObject({ frontendUrl, id, title, description, withImage: true })
	}

	const description = paste.link ? undefined : "This paste is encrypted and cannot be previewed"

	return buildPasteMetadataObject({ frontendUrl, id, title, description, withImage: true })
}
