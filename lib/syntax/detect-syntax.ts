import TOML from "@tree-sitter-grammars/tree-sitter-toml"
import Parser from "tree-sitter"
import Bash from "tree-sitter-bash"
import Go from "tree-sitter-go"
import Python from "tree-sitter-python"
import Rust from "tree-sitter-rust"

import type { Syntax } from "@/lib/form"
import { evaluateParser } from "@/lib/syntax/parser"
// @ts-ignore: bad typings in tree-sitter-toml
import type { z } from "zod"

const TSX = require("tree-sitter-typescript").tsx

type SyntaxParser = {
	syntax: z.infer<typeof Syntax>
	parser: Parser
}

type SyntaxScore = {
	syntax: z.infer<typeof Syntax>
	errorScore: number
}

export const syntaxPriority: Record<z.infer<typeof Syntax>, number> = {
	toml: 5,
	go: 4,
	rust: 3,
	tsx: 2,
	python: 1,
	bash: 0
}

const selectSyntaxWithHighestPriority = (scores: SyntaxScore[]) => {
	const groupedByErrorScore = scores.reduce(
		(acc, curr) => {
			if (!acc[curr.errorScore]) acc[curr.errorScore] = []
			acc[curr.errorScore].push(curr)
			return acc
		},
		{} as Record<number, SyntaxScore[]>
	)

	const lowestErrorScore = Math.min(...Object.keys(groupedByErrorScore).map(Number))
	const candidates = groupedByErrorScore[lowestErrorScore]
	const sortedCandidates = candidates.sort((a, b) => syntaxPriority[b.syntax] - syntaxPriority[a.syntax])

	return sortedCandidates[0]?.syntax
}

export const detectContentSyntax = (content: string): z.infer<typeof Syntax> | undefined => {
	const contentToParse = content.length > 4096 ? content.slice(0, 4096) : content

	const syntaxToParserLanguageMap: {
		// biome-ignore lint/suspicious/noExplicitAny: bad typings in tree-sitter
		[syntax in z.infer<typeof Syntax>]: any
	} = {
		go: Go,
		tsx: TSX,
		python: Python,
		rust: Rust,
		bash: Bash,
		toml: TOML
	}

	const languageParsers: (SyntaxParser | undefined)[] = Object.entries(syntaxToParserLanguageMap).map(
		([syntax, parserLanguage]) => {
			try {
				const parser = new Parser()
				parser.setLanguage(parserLanguage)
				return { syntax: syntax as z.infer<typeof Syntax>, parser }
			} catch (error) {
				console.error(`Error initializing parser for ${syntax}: ${error}`)
				return undefined
			}
		}
	)

	const scores: SyntaxScore[] = languageParsers
		.filter((languageParser) => languageParser !== undefined)
		.map(({ syntax, parser }) => ({
			syntax: syntax,
			errorScore: evaluateParser(parser, contentToParse)
		}))

	return selectSyntaxWithHighestPriority(scores)
}
