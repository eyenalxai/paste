type WrapProps = {
	syntax: string
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

	return `\`\`\`${syntax}\n${content}\n\`\`\``
}
