import { PasteError } from "@/components/error/paste-error"
import { ClientPasteDisplay } from "@/components/paste-display/client-paste-display"
import { ServerPasteDisplay } from "@/components/paste-display/server-paste-display"
import { deleteExpirePastes, deletePaste } from "@/lib/database/delete"
import { getPaste } from "@/lib/database/select"
import { extractIdAndExtension } from "@/lib/id-extension"
import { wrapInMarkdown } from "@/lib/markdown"
import { buildPasteMetadata } from "@/lib/paste-metadata"
import { headers } from "next/headers"
import { permanentRedirect } from "next/navigation"

export type PastePageProps = {
	params: {
		idWithExt: string
	}
}

export async function generateMetadata({ params: { idWithExt } }: PastePageProps) {
	const [id] = extractIdAndExtension(idWithExt)
	const paste = await getPaste(id)

	return await buildPasteMetadata({ id, paste })
}

export default async function Page({ params: { idWithExt } }: PastePageProps) {
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

	const content = paste.content.toString("utf-8")

	if (!paste.ivClientBase64) {
		if (paste.link) {
			if (!isBot) {
				permanentRedirect(content)
			}

			return `Placeholder for SEO bots: ${content}`
		}

		return (
			<ServerPasteDisplay
				id={id}
				markdown={wrapInMarkdown({ syntax: paste.syntax, extension, content })}
				decryptedContent={content}
				oneTime={paste.oneTime ?? false} // TODO: Fix this
			/>
		)
	}

	return (
		<ClientPasteDisplay
			ivClientBase64={paste.ivClientBase64}
			clientEncryptedContent={content}
			link={paste.link}
			oneTime={paste.oneTime ?? false}
			syntax={paste.syntax}
			extension={extension}
		/>
	)
}
