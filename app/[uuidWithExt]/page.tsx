import { PasteContainer } from "@/components/paste-container"
import { PasteDisplay } from "@/components/paste-display"
import { serverDecryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { wrapInMarkdown } from "@/lib/markdown"
import { getPaste } from "@/lib/select"
import { extractUuidAndExtension } from "@/lib/uuid-extension"
import { all } from "lowlight"
import { MDXRemote } from "next-mdx-remote/rsc"
import { permanentRedirect } from "next/navigation"
import rehypeHighlight from "rehype-highlight"

export type PastePageProps = {
	params: {
		uuidWithExt: string
	}
	searchParams: {
		key: string
	}
}

export default async function Page({ params: { uuidWithExt }, searchParams: { key } }: PastePageProps) {
	const [uuid, extension] = extractUuidAndExtension(uuidWithExt)

	const [paste] = await getPaste(uuid)

	if (!paste) return <h1>Paste does not exist or has expired</h1>

	const decryptedContent = await serverDecryptPaste({
		keyBase64: decodeURIComponent(key),
		ivBase64: paste.ivServerBase64,
		encryptedContentBase64: paste.content
	})

	if (!paste.ivClientBase64) {
		if (paste.link) {
			permanentRedirect(decryptedContent)
		}

		const wrapped = wrapInMarkdown({ syntax: paste.syntax, content: decryptedContent, extension })

		return (
			<PasteContainer content={decryptedContent} uuid={uuid} noWrap>
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

	return (
		<PasteDisplay
			uuid={uuid}
			ivClientBase64={paste.ivClientBase64}
			serverDecryptedContent={decryptedContent}
			link={paste.link}
			syntax={paste.syntax}
			extension={extension}
		/>
	)
}
