import { ClientPasteDisplay } from "@/components/paste-display/client-paste-display"
import { ServerPasteDisplay } from "@/components/paste-display/server-paste-display"
import { serverDecryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { env } from "@/lib/env.mjs"
import { getPaste } from "@/lib/select"
import { getTitle } from "@/lib/title"
import { extractUuidAndExtension } from "@/lib/uuid-extension"
import type { Metadata } from "next"
import { permanentRedirect } from "next/navigation"

export type PastePageProps = {
	params: {
		uuidWithExt: string
	}
	searchParams: {
		key: string
	}
}

export async function generateMetadata({ params: { uuidWithExt }, searchParams: { key } }: PastePageProps) {
	const frontendUrl = env.NEXT_PUBLIC_FRONTEND_URL

	const [uuid] = extractUuidAndExtension(uuidWithExt)

	const [paste] = await getPaste(uuid)

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
				url: new URL(`${frontendUrl}/${uuid}`),
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

export default async function Page({ params: { uuidWithExt }, searchParams: { key } }: PastePageProps) {
	const [uuid, extension] = extractUuidAndExtension(uuidWithExt)

	const [paste] = await getPaste(uuid)

	if (!paste) return <h1>Paste does not exist or has expired</h1>

	if (!paste.ivClientBase64) {
		if (!paste.ivServer) throw new Error("Paste is somehow not encrypted at client-side or server-side")

		const keyBase64 = decodeURIComponent(key)

		const decryptedContent = await serverDecryptPaste({
			keyBase64: keyBase64,
			ivServer: paste.ivServer,
			encryptedBuffer: paste.content
		})

		if (paste.link) {
			permanentRedirect(decryptedContent)
		}

		return (
			<ServerPasteDisplay
				uuid={uuid}
				syntax={paste.syntax}
				decryptedContent={decryptedContent}
				extension={extension}
				keyBase64={keyBase64}
			/>
		)
	}

	return (
		<ClientPasteDisplay
			uuid={uuid}
			ivClientBase64={paste.ivClientBase64}
			clientEncryptedContent={paste.content.toString("utf-8")}
			link={paste.link}
			syntax={paste.syntax}
			extension={extension}
		/>
	)
}
