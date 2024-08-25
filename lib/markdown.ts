import { getErrorMessage } from "@/lib/error-message"
import { all } from "lowlight"
import { ResultAsync } from "neverthrow"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import rehypeSanitize from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkMath from "remark-math"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

type WrapProps = {
	syntax: string | undefined
	extension: string | undefined
	content: string
}

export const wrapInMarkdown = ({ syntax, extension, content }: WrapProps) => {
	if (extension !== undefined) {
		return extension.toLowerCase() === "markdown" ? content : `\`\`\`${extension}\n${content}\n\`\`\``
	}

	if (syntax === "markdown") {
		return content
	}

	if (syntax === undefined) {
		return `\`\`\`plaintext\n${content}\n\`\`\``
	}

	return `\`\`\`${syntax}\n${content}\n\`\`\``
}

type toMarkdownProps = {
	rawContent: string
	syntax?: string
	extension?: string
}

export const toMarkdown = ({ syntax, extension, rawContent }: toMarkdownProps) => {
	return ResultAsync.fromPromise(
		unified()
			.use(remarkParse)
			.use(remarkMath)
			.use(remarkRehype)
			.use(rehypeSanitize)
			.use(rehypeKatex)
			.use(rehypeHighlight, { languages: all })
			.use(rehypeStringify)
			.process(wrapInMarkdown({ syntax, extension, content: rawContent })),
		(e) => getErrorMessage(e, "Failed to convert to markdown")
	)
}
