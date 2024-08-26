import { Syntax } from "@/lib/syntax/select"
import { z } from "zod"

export const StringBoolean = z.union([z.boolean(), z.string()]).transform((value) => {
	if (typeof value === "string") {
		return value.toLowerCase() === "true"
	}
	return value
})

export const SyntaxOptional = z
	.string()
	.optional()
	.transform((value) =>
		value === "" || value === "undefined" || value === undefined ? undefined : value.toLowerCase()
	)
	.optional()
	.or(Syntax)

export const ExpiresAfter = z.enum(["5-minutes", "30-minutes", "1-hour", "6-hours", "1-day", "1-week", "1-month"])
export const ContentType = z.enum(["auto", "link", "markdown", "source", "plaintext"])

export const SavePasteResponseSchema = z.object({
	id: z.string(),
	url: z.string().url(),
	syntax: z.string()
})
