import type { AllSyntax } from "@/lib/types"

type WrapProps = {
	syntax: AllSyntax | null
	extension: string | undefined
	content: string
}

export const wrapInMarkdown = ({ syntax, extension, content }: WrapProps) => {
	if (extension !== undefined) {
		return `\`\`\`${extension}\n${content}\n\`\`\``
	}

	if (syntax === "markdown") {
		return content
	}

	return syntax ? `\`\`\`${syntax}\n${content}\n\`\`\`` : `\`\`\`plaintext\n${content}\n\`\`\``
}
