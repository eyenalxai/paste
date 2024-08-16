import { ClientPasteDisplay } from "@/components/paste-display/client-paste-display"
import { ServerPasteDisplay } from "@/components/paste-display/server-paste-display"
import { serverDecryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { getPaste } from "@/lib/database/select"
import { extractIdAndExtension } from "@/lib/id-extension"
import { buildPasteMetadata } from "@/lib/paste-metadata"
import { headers } from "next/headers"
import { permanentRedirect } from "next/navigation"

export type PastePageProps = {
	params: {
		idWithExt: string
	}
	searchParams: {
		key?: string
	}
}

export async function generateMetadata({ params: { idWithExt }, searchParams: { key } }: PastePageProps) {
	const [id] = extractIdAndExtension(idWithExt)
	const [paste] = await getPaste(id)

	return await buildPasteMetadata({ id, paste, key })
}

export default async function Page({ params: { idWithExt }, searchParams: { key } }: PastePageProps) {
	const [id, extension] = extractIdAndExtension(idWithExt)

	const [paste] = await getPaste(id)

	if (!paste) return <h1>Paste does not exist or has expired</h1>

	if (!paste.ivClientBase64) {
		if (!paste.ivServer) throw new Error("Paste is somehow not encrypted at client-side or server-side")
		if (!key) throw new Error("key is required to decrypt server-side encrypted paste")

		const keyBase64 = decodeURIComponent(key)

		const decryptedContent = await serverDecryptPaste({
			keyBase64: keyBase64,
			ivServer: paste.ivServer,
			encryptedBuffer: paste.content
		})

		if (paste.link) {
			const headersList = headers()
			const userAgent = headersList.get("user-agent")
			if (!userAgent || !userAgent.toLowerCase().includes("bot")) permanentRedirect(decryptedContent)
		}

		return (
			<ServerPasteDisplay
				id={id}
				syntax={paste.syntax}
				decryptedContent={decryptedContent}
				extension={extension}
				keyBase64={keyBase64}
			/>
		)
	}

	return (
		<ClientPasteDisplay
			id={id}
			ivClientBase64={paste.ivClientBase64}
			clientEncryptedContent={paste.content.toString("utf-8")}
			link={paste.link}
			syntax={paste.syntax}
			extension={extension}
		/>
	)
}
