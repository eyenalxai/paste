type WrapProps = {
	syntax: string | undefined
	extension?: string | undefined
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
