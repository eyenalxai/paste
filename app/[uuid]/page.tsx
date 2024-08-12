import { PasteContainer } from "@/components/paste-container"
import { PasteDisplay } from "@/components/paste-display"
import { RemoteMdx } from "@/components/remote-mdx"
import { clientEnv } from "@/lib/env/client"
import { wrapInMarkdown } from "@/lib/markdown"
import { getPaste } from "@/lib/select"
import type { Metadata } from "next"

export type PastePageProps = {
	params: {
		uuid: string
	}
}

export async function generateMetadata({ params: { uuid } }: PastePageProps) {
	const [paste] = await getPaste({ uuid })

	if (!paste) {
		const title = "Paste does not exist or has expired"
		return {
			title: title,
			openGraph: {
				title: title,
				url: new URL(`${clientEnv.frontendUrl}/${uuid}`),
				type: "website"
			}
		} satisfies Metadata
	}

	if (paste.ivBase64) {
		const title = "Encrypted paste"
		const description = "This paste is encrypted and cannot be previewed"
		return {
			title: title,
			description: description,
			openGraph: {
				title: title,
				description: description,
				url: new URL(`${clientEnv.frontendUrl}/${uuid}`),
				type: "website"
			}
		} satisfies Metadata
	}

	const title = "Paste"
	const description = paste.content.length > 64 ? `${paste.content.slice(0, 64)}...` : paste.content

	return {
		title: title,
		description: description,
		openGraph: {
			title: title,
			description: description,
			url: new URL(`${clientEnv.frontendUrl}/${uuid}`),
			type: "website"
		}
	} satisfies Metadata
}

export default async function Page({ params: { uuid } }: PastePageProps) {
	const [paste] = await getPaste({ uuid })

	if (!paste) return <h1>Paste does not exist or has expired</h1>

	if (!paste.ivBase64) {
		const wrapped = wrapInMarkdown({ syntax: paste.syntax, content: paste.content })

		return (
			<PasteContainer content={paste.content} uuid={uuid}>
				<RemoteMdx source={wrapped} />
			</PasteContainer>
		)
	}

	return <PasteDisplay uuid={uuid} />
}
