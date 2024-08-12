import type { AllSyntax } from "@/lib/types"

type WrapProps = {
	syntax: AllSyntax | null
	content: string
}

export const wrapInMarkdown = ({ syntax, content }: WrapProps) => {
	if (syntax === "markdown") {
		console.log("Markdown detected")
		return content
	}

	return syntax ? `\`\`\`${syntax}\n${content}\n\`\`\`` : `\`\`\`plaintext\n${content}\n\`\`\``
}
