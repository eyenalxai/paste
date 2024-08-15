import { Syntax } from "@/lib/syntax/select"
import { isValidUrl } from "@/lib/url"
import { z } from "zod"

export const ExpiresAfter = z.enum(["5-minutes", "30-minutes", "1-hour", "6-hours", "1-day", "1-week", "1-month"])
export const ContentType = z.enum(["auto", "link", "markdown", "source", "plaintext"])

export const InitializationVectorSchema = z.object({
	ivClient: z.string().optional()
})

export const FrontendOnlyDataSchema = z.object({
	encrypted: z.boolean()
})

export const SharedFormFields = z.object({
	content: z.string().min(2, {
		message: "Paste must be at least 2 characters long"
	}),
	oneTime: z.boolean(),
	expiresAfter: ExpiresAfter,
	contentType: ContentType,
	syntax: Syntax.optional()
})

export const PasteFormSchema = SharedFormFields.merge(FrontendOnlyDataSchema)
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

export const SecurePasteFormSchema = SharedFormFields.merge(InitializationVectorSchema).refine(
	({ contentType }) => contentType !== "auto" || process.env.NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION,
	{
		message: "Automatic content type detection is not available"
	}
)

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
