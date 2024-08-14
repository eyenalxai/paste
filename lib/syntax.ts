import type { ContentType } from "@/lib/form"
import { openaiClient } from "@/lib/openai"
import type { AllSyntax } from "@/lib/types"
import { z } from "zod"

type GetPasteLanguageProps = {
	encrypted: boolean
	content: string
	contentType: z.infer<typeof ContentType>
	syntax?: AllSyntax
}

export const getPasteSyntax = async ({ encrypted, syntax, contentType, content }: GetPasteLanguageProps) => {
	if (syntax) return syntax
	if (contentType === "markdown") return "markdown"

	return encrypted ? undefined : await detectContentSyntax(content)
}

export const SyntaxSchema = z.object({
	syntax: z.string()
})

export const detectContentSyntax = async (content: string) => {
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
					"Respond using following json schema: { syntax: string }"
			},
			{ role: "user", content: content }
		],
		model: "gpt-3.5-turbo",
		response_format: {
			type: "json_object"
		}
	})

	const response = chatCompletion.choices[0].message.content

	if (response === null) {
		console.error("Received null response from OpenAI")
		return undefined
	}

	const { syntax } = SyntaxSchema.parse(JSON.parse(response))

	console.log(`Detected syntax: ${syntax}`)

	return syntax
}
