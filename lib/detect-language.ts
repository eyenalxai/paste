import Parser from "tree-sitter"
import Bash from "tree-sitter-bash"
import Go from "tree-sitter-go"
import Python from "tree-sitter-python"
import Rust from "tree-sitter-rust"

import { evaluateParser } from "@/lib/parser"
// @ts-ignore: bad typings in tree-sitter-toml
import TOML from "tree-sitter-toml"

const TSX = require("tree-sitter-typescript").tsx

export type Language = "go" | "tsx" | "python" | "rust" | "bash" | "toml"

type LanguageParser = {
	language: Language
	parser: Parser
}

type LanguageScore = {
	language: Language
	errorScore: number
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
		python: Python,
		rust: Rust,
		bash: Bash,
		toml: TOML
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
			errorScore: evaluateParser({ parser, content: contentToParse })
		}))

	console.log(scores)

	const result = scores.reduce<LanguageScore | undefined>((acc, curr) => {
		if (!acc || curr.errorScore < acc.errorScore) {
			return curr
		}
		return acc
	}, undefined)

	return result?.language
}
