import type { Language } from "@/lib/detect-language"

type WrapProps = {
	language: Language
	content: string
}

export const wrapper = ({ language, content }: WrapProps) => {
	return `\`\`\`${language}\n${content}\n\`\`\``
}
