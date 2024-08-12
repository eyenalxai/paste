import type { ContentType } from "@/lib/form"
import { detectContentSyntax } from "@/lib/syntax/detect-language"
import type { AllSyntax } from "@/lib/types"
import type { z } from "zod"

type GetPasteLanguageProps = {
	syntax?: AllSyntax
	contentType: z.infer<typeof ContentType>
	content: string
}

export const getPasteSyntax = ({ syntax, contentType, content }: GetPasteLanguageProps): AllSyntax | undefined => {
	if (syntax) return syntax

	if (contentType === "markdown") {
		return "markdown"
	}

	return detectContentSyntax({ content })
}
