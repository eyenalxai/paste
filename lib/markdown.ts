import type { Language } from "@/lib/detect-language"

type WrapProps = {
	language: Language | null
	content: string
}

export const wrapper = ({ language, content }: WrapProps) => {
	return language ? `\`\`\`${language}\n${content}\n\`\`\`` : `\`\`\`plaintext\n${content}\n\`\`\``
}
