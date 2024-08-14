import { isValidUrl } from "@/lib/url"
import { z } from "zod"

export const ExpiresAfter = z.enum(["5-minutes", "30-minutes", "1-hour", "6-hours", "1-day", "1-week", "1-month"])
export const ContentType = z.enum(["auto", "link", "markdown", "source", "plaintext"])
export const Syntax = z.enum([
	".env",
	"apache",
	"bash",
	"c",
	"cpp",
	"csharp",
	"css",
	"dart",
	"dockerfile",
	"go",
	"graphql",
	"groovy",
	"html",
	"ini",
	"java",
	"json",
	"jsx",
	"kotlin",
	"kubernetes",
	"lua",
	"makefile",
	"nginx",
	"perl",
	"php",
	"powershell",
	"protobuf",
	"python",
	"r",
	"ruby",
	"rust",
	"scala",
	"shell",
	"sql",
	"swift",
	"toml",
	"tsx",
	"xml",
	"yaml"
])
export const selectSyntaxOptions: Record<z.infer<typeof Syntax>, string> = {
	".env": "Environment",
	apache: "Apache",
	bash: "Bash",
	c: "C",
	cpp: "C++",
	csharp: "C#",
	css: "CSS",
	dart: "Dart",
	dockerfile: "Dockerfile",
	go: "Go",
	graphql: "GraphQL",
	groovy: "Groovy",
	html: "HTML",
	ini: "INI",
	java: "Java",
	jsx: "JavaScript",
	json: "JSON",
	kotlin: "Kotlin",
	kubernetes: "Kubernetes",
	lua: "Lua",
	makefile: "Makefile",
	nginx: "Nginx",
	perl: "Perl",
	php: "PHP",
	powershell: "PowerShell",
	protobuf: "Protobuf",
	python: "Python",
	r: "R",
	ruby: "Ruby",
	rust: "Rust",
	scala: "Scala",
	shell: "Shell",
	sql: "SQL",
	swift: "Swift",
	toml: "TOML",
	tsx: "TypeScript",
	xml: "XML",
	yaml: "YAML"
}

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
	.refine((data) => !(data.contentType === "source" && data.syntax === undefined), {
		message: "Must select a syntax for source code",
		path: ["syntax"]
	})
	.refine((data) => !(data.contentType === "link" && !isValidUrl(data.content)), {
		message: "Invalid URL"
	})
	.refine((data) => data.contentType !== "auto" || process.env.NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION, {
		message: "Automatic content type detection is not available"
	})

export const SecurePasteFormSchema = SharedFormFields.merge(InitializationVectorSchema).refine(
	(data) => data.contentType !== "auto" || process.env.NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION,
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
