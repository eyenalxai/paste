import { serverDecryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { env } from "@/lib/env.mjs"
import type { Paste } from "@/lib/schema"
import { getTitle } from "@/lib/title"
import type { Metadata } from "next"

type BuildPasteMetadataProps = {
	uuid: string
	paste: Paste
	key: string | undefined
}

export const buildPasteMetadata = async ({ uuid, paste, key }: BuildPasteMetadataProps) => {
	const frontendUrl = env.NEXT_PUBLIC_FRONTEND_URL

	if (!paste) {
		const title = "Paste does not exist or has expired"
		return {
			title: title,
			openGraph: {
				title: title,
				url: new URL(`${frontendUrl}/${uuid}`),
				type: "website"
			}
		} satisfies Metadata
	}

	const title = getTitle({ paste })

	if (!paste.ivClientBase64) {
		if (!paste.ivServer) throw new Error("Paste is somehow not encrypted at client-side or server-side")
		if (!key) throw new Error("key is required to decrypt server-side encrypted paste")

		const decryptedContent = await serverDecryptPaste({
			keyBase64: decodeURIComponent(key),
			ivServer: paste.ivServer,
			encryptedBuffer: paste.content
		})

		const description = decryptedContent.length > 64 ? `${decryptedContent.slice(0, 64)}...` : decryptedContent

		return {
			title: title,
			description: description,
			openGraph: {
				title: title,
				description: description,
				url: new URL(`${frontendUrl}/${uuid}?key=${key}`),
				type: "website"
			}
		} satisfies Metadata
	}

	const description = "This paste is encrypted and cannot be previewed"
	return {
		title: title,
		description: description,
		openGraph: {
			title: title,
			description: description,
			url: new URL(`${frontendUrl}/${uuid}`),
			type: "website"
		}
	} satisfies Metadata
}
