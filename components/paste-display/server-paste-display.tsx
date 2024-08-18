import { PasteContainer } from "@/components/paste-container"
import { wrapInMarkdown } from "@/lib/markdown"
import { all } from "lowlight"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeHighlight from "rehype-highlight"

type ServerPasteDisplayProps = {
	id: string
	syntax: string
	oneTime: boolean

	decryptedContent: string
	extension: string | undefined
	keyBase64: string
}

export const ServerPasteDisplay = ({
	id,
	syntax,
	oneTime,
	decryptedContent,
	extension,
	keyBase64
}: ServerPasteDisplayProps) => {
	const wrapped = wrapInMarkdown({ syntax: syntax, content: decryptedContent, extension })

	return (
		<PasteContainer content={decryptedContent} oneTime={oneTime} id={id} keyBase64={keyBase64} noWrap>
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
