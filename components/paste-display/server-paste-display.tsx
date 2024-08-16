import { PasteContainer } from "@/components/paste-container"
import { wrapInMarkdown } from "@/lib/markdown"
import { all } from "lowlight"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeHighlight from "rehype-highlight"

type ServerPasteDisplayProps = {
	id: string
	syntax: string
	decryptedContent: string
	extension: string | undefined
	keyBase64: string
}

export const ServerPasteDisplay = ({ id, syntax, decryptedContent, extension, keyBase64 }: ServerPasteDisplayProps) => {
	const wrapped = wrapInMarkdown({ syntax: syntax, content: decryptedContent, extension })

	return (
		<PasteContainer content={decryptedContent} id={id} keyBase64={keyBase64} noWrap>
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
