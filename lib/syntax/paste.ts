import type { ContentType } from "@/lib/form"
import { detectContentSyntax } from "@/lib/syntax/detect-syntax"
import type { AllSyntax } from "@/lib/types"
import type { z } from "zod"

type GetPasteLanguageProps = {
	encrypted: boolean
	content: string
	contentType: z.infer<typeof ContentType>
	syntax?: AllSyntax
}

export const getPasteSyntax = ({
	encrypted,
	syntax,
	contentType,
	content
}: GetPasteLanguageProps): AllSyntax | undefined => {
	if (syntax) return syntax

	if (contentType === "markdown") {
		return "markdown"
	}

	return encrypted ? undefined : detectContentSyntax(content)
}
