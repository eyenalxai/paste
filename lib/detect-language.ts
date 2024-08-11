import { evaluateParser } from "@/lib/parser"
import Parser from "tree-sitter"
import Go from "tree-sitter-go"
import Python from "tree-sitter-python"

const TSX = require("tree-sitter-typescript").tsx

export type Language = "go" | "tsx" | "python"

type LanguageParser = {
	language: Language
	parser: Parser
}

type LanguageScore = {
	language: Language
	score: number
}

type DetectContentLanguageProps = {
	content: string
}

export const detectContentLanguage = ({ content }: DetectContentLanguageProps): Language | undefined => {
	const contentToParse = content.length > 256 ? content.slice(0, 256) : content

	const languageToParserLanguageMap: {
		// biome-ignore lint/suspicious/noExplicitAny: bad typings in tree-sitter
		[language in Language]: any
	} = {
		go: Go,
		tsx: TSX,
		python: Python
	}

	const languageParsers: (LanguageParser | undefined)[] = Object.entries(languageToParserLanguageMap).map(
		([language, parserLanguage]) => {
			try {
				const parser = new Parser()
				parser.setLanguage(parserLanguage)
				return { language: language as Language, parser }
			} catch (error) {
				console.error(`Error initializing parser for ${language}: ${error}`)
				return undefined
			}
		}
	)

	const scores: LanguageScore[] = languageParsers
		.filter((languageParser) => languageParser !== undefined)
		.map(({ language, parser }) => ({
			language,
			score: evaluateParser({ parser, content: contentToParse })
		}))

	const highestScore = scores.reduce((acc, { score }) => (score > acc ? score : acc), 0)

	return highestScore > 80 ? scores.find(({ score }) => score === highestScore)?.language : undefined
}
