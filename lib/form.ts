import { env } from "@/lib/env.mjs"
import { Syntax } from "@/lib/syntax/select"
import { isValidUrl } from "@/lib/url"
import { z } from "zod"
import { zfd } from "zod-form-data"

const StringBoolean = z.union([z.boolean(), z.string()]).transform((value) => {
	if (typeof value === "string") {
		return value.toLowerCase() === "true"
	}
	return value
})

const Content = z
	.string()
	.transform((value) => value.trim())
	.refine((value) => value.length >= 2, {
		message: "Paste must be at least 2 non-whitespace characters"
	})
const OneTime = StringBoolean
const SyntaxOptional = z
	.string()
	.optional()
	.transform((value) =>
		value === "" || value === "undefined" || value === undefined ? undefined : value.toLowerCase()
	)
	.optional()
	.or(Syntax)

export const ExpiresAfter = z.enum(["5-minutes", "30-minutes", "1-hour", "6-hours", "1-day", "1-week", "1-month"])
export const ContentType = z.enum(["auto", "link", "markdown", "source", "plaintext"])

export const FrontendSchema = z
	.object({
		encrypted: StringBoolean,
		content: z
			.string()
			.transform((value) => value.trim())
			.refine((value) => value.length >= 2, {
				message: "Paste must be at least 2 non-whitespace characters"
			}),
		oneTime: OneTime,
		expiresAfter: ExpiresAfter,
		contentType: ContentType,
		syntax: SyntaxOptional
	})
	.refine(({ contentType, syntax }) => !(contentType === "source" && syntax === undefined), {
		message: "Must select a syntax for source code",
		path: ["syntax"]
	})
	.refine(({ contentType, content }) => !(contentType === "link" && !isValidUrl(content)), {
		message: "Invalid URL"
	})
	.refine(({ contentType }) => contentType !== "auto" || process.env.NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION, {
		message: "Automatic content type detection is not available"
	})
	.refine(({ encrypted, contentType }) => !(encrypted && contentType === "auto"), {
		message: "Encrypted pastes cannot have automatic content type detection"
	})

export const BackendSchema = zfd
	.formData({
		ivClient: z.string().optional(),
		contentBlob: zfd.file().refine((value) => value.size <= env.NEXT_PUBLIC_MAX_PAYLOAD_SIZE, {
			message: `Paste size exceeds ${env.NEXT_PUBLIC_MAX_PAYLOAD_SIZE / 1024 / 1024} MiB`
		}),
		oneTime: OneTime,
		expiresAfter: ExpiresAfter,
		contentType: ContentType,
		syntax: SyntaxOptional
	})
	.refine(({ contentType }) => contentType !== "auto" || process.env.NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION, {
		message: "Automatic content type detection is not available"
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
