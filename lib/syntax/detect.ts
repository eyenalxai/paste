import { ooofs } from "@/lib/ext"
import type { ContentType } from "@/lib/zod/form/common"
import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { z } from "zod"

type GetPasteLanguageProps = {
	encrypted: boolean
	content: string
	contentType: z.infer<typeof ContentType>
	syntax?: string
}

export const getPasteSyntax = async ({ encrypted, syntax, contentType, content }: GetPasteLanguageProps) => {
	if (syntax) return syntax
	if (contentType === "markdown") return "markdown"
	if (contentType === "plaintext") return "plaintext"
	if (encrypted) return "plaintext"

	if (contentType === "auto") return await detectContentSyntax(content)

	return "plaintext"
}

const SyntaxSchema = z.object({
	syntax: z.string()
})

export const detectContentSyntax = async (content: string) => {
	const openaiClient = new OpenAI({
		apiKey: "s"
	})

	const what = ooofs // Terser error
	// const what = "what" // No error

	const chatCompletion = await openaiClient.chat.completions.create({
		messages: [{ role: "user", content: content }],
		model: "gpt-4o-mini",
		response_format: zodResponseFormat(SyntaxSchema, what)
	})

	return "plaintext"
}
