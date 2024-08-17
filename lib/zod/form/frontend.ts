import { env } from "@/lib/env.mjs"
import { isValidUrl } from "@/lib/url"
import { ContentType, ExpiresAfter, StringBoolean, SyntaxOptional } from "@/lib/zod/form/common"
import { z } from "zod"

export const FrontendSchema = z
	.object({
		encrypted: StringBoolean,
		content: z
			.string()
			.transform((value) => value.trim())
			.refine((value) => value.length >= 2, {
				message: "Paste must be at least 2 non-whitespace characters"
			}),
		oneTime: StringBoolean,
		expiresAfter: ExpiresAfter,
		contentType: ContentType,
		syntax: SyntaxOptional
	})
	.refine(({ contentType, syntax }) => !(contentType === "source" && syntax === undefined), {
		message: "Must select a syntax for source code"
	})
	.refine(({ contentType, syntax }) => !(contentType !== "source" && syntax !== undefined), {
		message: "Syntax selection is only allowed for source content type"
	})
	.refine(({ contentType, content }) => !(contentType === "link" && !isValidUrl(content)), {
		message: "Invalid URL"
	})
	.refine(({ contentType }) => contentType !== "auto" || env.NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION, {
		message: "Automatic content type detection is not available"
	})
	.refine(({ encrypted, contentType }) => !(encrypted && contentType === "auto"), {
		message: "Encrypted pastes cannot have automatic content type detection"
	})
	.refine(({ encrypted }) => encrypted || !env.NEXT_PUBLIC_CLIENT_SIDE_ENCRYPTION_ONLY, {
		message: "Server-side encryption is disabled"
	})

export const selectExpiresAfterOptions: Record<z.infer<typeof ExpiresAfter>, string> = {
	"5-minutes": "5 minutes",
	"30-minutes": "30 minutes",
	"1-hour": "1 hour",
	"6-hours": "6 hours",
	"1-day": "1 day",
	"1-week": "1 week",
	"1-month": "1 month"
}

export const selectContentTypeOptions: Record<z.infer<typeof ContentType>, string> = {
	auto: "Auto",
	markdown: "Markdown",
	plaintext: "Plaintext",
	source: "Source",
	link: "Link"
}
