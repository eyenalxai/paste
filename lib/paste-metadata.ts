import { serverDecryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { env } from "@/lib/env.mjs"
import type { Paste } from "@/lib/schema"
import { getTitle } from "@/lib/title"
import type { Metadata } from "next"

type BuildPasteMetadataProps = {
	id: string
	paste: Paste
	key: string | undefined
}

export const buildPasteMetadata = async ({ id, paste, key }: BuildPasteMetadataProps) => {
	const frontendUrl = env.NEXT_PUBLIC_FRONTEND_URL

	if (!paste) {
		const title = "Paste does not exist or has expired"
		return {
			title: title,
			openGraph: {
				title: title,
				url: new URL(`${frontendUrl}/${id}`),
				type: "website"
			}
		} satisfies Metadata
	}

	const title = getTitle({ paste })

	if (!paste.ivClientBase64) {
		if (!paste.ivServer) throw new Error("Paste is somehow not encrypted at client-side or server-side")
		if (!key) throw new Error("key is required to decrypt server-side encrypted paste")

		const decryptedContent = await serverDecryptPaste({
			keyBase64: key,
			ivServer: paste.ivServer,
			encryptedBuffer: paste.content
		})

		const contentTrimmed = decryptedContent.length > 32 ? `${decryptedContent.slice(0, 32)}...` : decryptedContent
		const description = paste.link ? undefined : contentTrimmed

		return {
			title: title,
			description: description,
			openGraph: {
				title: title,
				description: description,
				url: new URL(`${frontendUrl}/${id}?key=${encodeURIComponent(key)}`),
				type: "website",
				images: [
					{
						url: `/api/paste/${id}/image?key=${encodeURIComponent(key)}`,
						width: 1200,
						height: 630,
						alt: title,
						type: "image/png"
					}
				]
			}
		} satisfies Metadata
	}

	const description = paste.link ? undefined : "This paste is encrypted and cannot be previewed"

	return {
		title: title,
		description: description,
		openGraph: {
			title: title,
			description: description,
			url: new URL(`${frontendUrl}/${id}`),
			type: "website",
			images: [
				{
					url: `/api/paste/${id}/image`,
					width: 1200,
					height: 630,
					alt: title,
					type: "image/png"
				}
			]
		}
	} satisfies Metadata
}
