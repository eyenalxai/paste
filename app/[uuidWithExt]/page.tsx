import { PasteContainer } from "@/components/paste-container"
import { PasteDisplay } from "@/components/paste-display"
import { env } from "@/lib/env.mjs"
import { wrapInMarkdown } from "@/lib/markdown"
import { getPaste } from "@/lib/select"
import { extractUuidAndExtension } from "@/lib/uuid-extension"
import { all } from "lowlight"
import type { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import { permanentRedirect } from "next/navigation"
import rehypeHighlight from "rehype-highlight"

export type PastePageProps = {
	params: {
		uuidWithExt: string
	}
}

export async function generateMetadata({ params: { uuidWithExt } }: PastePageProps) {
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

	if (paste.ivClientBase64) {
		const title = "Encrypted paste"
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

	const title = "Paste"
	const description = paste.content.length > 64 ? `${paste.content.slice(0, 64)}...` : paste.content

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

export default async function Page({ params: { uuidWithExt } }: PastePageProps) {
	const [uuid, extension] = extractUuidAndExtension(uuidWithExt)

	const [paste] = await getPaste(uuid)

	if (!paste) return <h1>Paste does not exist or has expired</h1>

	if (!paste.ivClientBase64) {
		if (paste.link) {
			permanentRedirect(paste.content)
		}

		const wrapped = wrapInMarkdown({ syntax: paste.syntax, content: paste.content, extension })

		return (
			<PasteContainer content={paste.content} uuid={uuid} noWrap>
				<MDXRemote
					source={wrapped}
					options={{
						mdxOptions: {
							rehypePlugins: [
								[
									rehypeHighlight,
									{
										languages: all
									}
								]
							]
						}
					}}
				/>
			</PasteContainer>
		)
	}

	return <PasteDisplay uuid={uuid} syntax={paste.syntax} extension={extension} />
}
