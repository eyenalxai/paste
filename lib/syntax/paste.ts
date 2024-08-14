import type { ContentType } from "@/lib/form"
import type { AllSyntax } from "@/lib/types"
import type { z } from "zod"

export const getPasteSyntax = (
	syntax: AllSyntax | undefined,
	contentType: z.infer<typeof ContentType>
): AllSyntax | undefined => {
	if (syntax) return syntax
	if (contentType === "markdown") return "markdown"

	return undefined
}
