import { PasteContainer } from "@/components/paste-container"
import { wrapInMarkdown } from "@/lib/markdown"
import { all } from "lowlight"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeHighlight from "rehype-highlight"

type ServerPasteDisplayProps = {
	uuid: string
	syntax: string
	decryptedContent: string
	extension: string | undefined
	key: string
}

export const ServerPasteDisplay = ({ uuid, syntax, decryptedContent, extension, key }: ServerPasteDisplayProps) => {
	const wrapped = wrapInMarkdown({ syntax: syntax, content: decryptedContent, extension })

	return (
		<PasteContainer content={decryptedContent} uuid={uuid} keyBase64={decodeURIComponent(key)} noWrap>
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
