import { PasteError } from "@/components/error/paste-error"
import { ClientPasteDisplay } from "@/components/paste-display/client-paste-display"
import { ServerPasteDisplay } from "@/components/paste-display/server-paste-display"
import { serverDecryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { deleteExpirePastes, deletePaste } from "@/lib/database/delete"
import { getPaste } from "@/lib/database/select"
import { extractIdAndExtension } from "@/lib/id-extension"
import { toMarkdown } from "@/lib/markdown"
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
	const paste = await getPaste(id)

	return await buildPasteMetadata({ id, paste, key })
}

export default async function Page({ params: { idWithExt }, searchParams: { key } }: PastePageProps) {
	await deleteExpirePastes()

	const [id, extension] = extractIdAndExtension(idWithExt)

	const paste = await getPaste(id)

	if (!paste) {
		return (
			<PasteError
				title={"Paste not found"}
				description={"The paste you are looking for does not exist or has been deleted."}
			/>
		)
	}

	const headersList = headers()
	const userAgent = headersList.get("user-agent")
	const isBot = userAgent?.toLowerCase().includes("bot") ?? false

	if (paste.oneTime && !isBot) {
		await deletePaste(paste.id)
	}

	if (!paste.ivClientBase64) {
		if (paste.link) {
			const content = paste.content.toString("utf-8")

			if (!isBot) {
				permanentRedirect(content)
			}

			return `Placeholder for SEO bots: ${content}`
		}

		if (!paste.ivServer) {
			return (
				<PasteError
					title={"Failed to decrypt paste"}
					description={"The paste is somehow not encrypted at client-side or server-side."}
				/>
			)
		}

		if (!key) {
			return (
				<PasteError
					title={"Failed to decrypt paste"}
					description={"Encryption key is required to decrypt server-side encrypted paste."}
				/>
			)
		}

		return await serverDecryptPaste({
			keyBase64: decodeURIComponent(key),
			ivServer: paste.ivServer,
			encryptedBuffer: paste.content
		})
			.andThen((decryptedContent) =>
				toMarkdown({ syntax: paste.syntax, extension, rawContent: decryptedContent }).map((markdown) => ({
					markdown,
					decryptedContent
				}))
			)
			.match(
				({ markdown, decryptedContent }) => (
					<ServerPasteDisplay
						id={id}
						markdown={markdown}
						decryptedContent={decryptedContent}
						oneTime={paste.oneTime ?? false}
						keyBase64={key}
					/>
				),
				(error) => <PasteError title={"Failed to decrypt paste"} description={error} />
			)
	}

	return (
		<ClientPasteDisplay
			ivClientBase64={paste.ivClientBase64}
			clientEncryptedContent={paste.content.toString("utf-8")}
			link={paste.link}
			oneTime={paste.oneTime ?? false}
			syntax={paste.syntax}
			extension={extension}
		/>
	)
}
