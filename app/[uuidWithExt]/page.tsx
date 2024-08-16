import { ClientPasteDisplay } from "@/components/paste-display/client-paste-display"
import { ServerPasteDisplay } from "@/components/paste-display/server-paste-display"
import { serverDecryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { buildPasteMetadata } from "@/lib/paste-metadata"
import { getPaste } from "@/lib/select"
import { extractUuidAndExtension } from "@/lib/uuid-extension"

export type PastePageProps = {
	params: {
		uuidWithExt: string
	}
	searchParams: {
		key?: string
	}
}

export async function generateMetadata({ params: { uuidWithExt }, searchParams: { key } }: PastePageProps) {
	const [uuid] = extractUuidAndExtension(uuidWithExt)
	const [paste] = await getPaste(uuid)

	return await buildPasteMetadata({ uuid, paste, key })
}

export default async function Page({ params: { uuidWithExt }, searchParams: { key } }: PastePageProps) {
	const [uuid, extension] = extractUuidAndExtension(uuidWithExt)

	const [paste] = await getPaste(uuid)

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

		// if (paste.link) {
		// 	permanentRedirect(decryptedContent)
		// }

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
