import { z } from "zod"

export const ExpiresAfter = z.enum(["5-minutes", "30-minutes", "1-hour", "6-hours", "1-day", "1-week", "1-month"])
export const ContentType = z.enum(["auto", "markdown", "source", "plaintext"])
export const Syntax = z.enum(["go", "tsx", "python", "rust", "bash", "toml"])

export const InitializationVectorSchema = z.object({
	iv: z.string().optional()
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
	.refine((data) => !(data.encrypted && data.contentType === "auto"), {
		message: "Cannot auto-detect content type for encrypted pastes",
		path: ["contentType"]
	})
	.refine((data) => !(data.contentType === "source" && data.syntax === undefined), {
		message: "Must select a syntax for source code",
		path: ["syntax"]
	})

export const SecurePasteFormSchema = SharedFormFields.merge(InitializationVectorSchema)

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
	source: "Source"
}

export const selectLanguageOptions: Record<z.infer<typeof Syntax>, string> = {
	bash: "Bash",
	go: "Go",
	python: "Python",
	rust: "Rust",
	toml: "TOML",
	tsx: "TypeScript"
}
