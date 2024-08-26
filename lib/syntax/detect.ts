import { env } from "@/lib/env.mjs"
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

	if (contentType === "auto" && env.NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION) return await detectContentSyntax(content)

	return "plaintext"
}

export const SyntaxSchema = z.object({
	syntax: z.string()
})

export const detectContentSyntax = async (content: string) => {
	const truncatedContent = content.length > 512 ? `${content.slice(0, 512)}...` : content

	const openaiClient = new OpenAI({
		apiKey: env.OPENAI_API_KEY
	})

	const chatCompletion = await openaiClient.chat.completions.create({
		messages: [
			{
				role: "system",
				content:
					"You need to detect the syntax of user content, " +
					"it might be a programming language, " +
					"a markup language, a configuration file, or something else. " +
					"Respond with a syntax name to be used later in Markdown code blocks. Must be from the list of supported syntaxes by Markdown. " +
					"Try to differentiate between JavaScript, JSX, TypeScript, TSX and other such examples from other languages. " +
					"Respond with plaintext if you were not able to detect the syntax." +
					'If content looks like Markdown, respond with "markdown". ' +
					'If content looks like LaTeX, respond with "markdown" as well. ' +
					"Also you might be working with incomplete content, so be prepared for that and try to detect the syntax as best as you can. " +
					"Respond using following json schema: { syntax: string }"
			},
			{ role: "user", content: truncatedContent }
		],
		model: "gpt-4o-mini",
		response_format: zodResponseFormat(SyntaxSchema, "syntax")
	})

	const response = chatCompletion.choices[0].message.content

	if (response === null) {
		console.error("Got null response from OpenAI")
		return "plaintext"
	}

	const { syntax } = SyntaxSchema.parse(JSON.parse(response))

	return syntax
}
