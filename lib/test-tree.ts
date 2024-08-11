import Parser from "tree-sitter"
import Go from "tree-sitter-go"

import Python from "tree-sitter-python"

const TSX = require("tree-sitter-typescript").tsx
const TypeScript = require("tree-sitter-typescript").typescript

function evaluateParser(content: string, language: any) {
	const parser = new Parser()
	parser.setLanguage(language)
	console.log("using language", parser.getLanguage().name)

	const tree = parser.parse(content)

	const countNodes = (
		node: Parser.SyntaxNode,
		counts: { total: number; errors: number }
	): { total: number; errors: number } => {
		counts.total++

		if (node.hasError) {
			counts.errors++
		}

		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i)
			if (child) {
				countNodes(child, counts)
			}
		}

		return counts
	}

	const { total, errors } = countNodes(tree.rootNode, { total: 0, errors: 0 })

	return total > 0 ? ((total - errors) / total) * 100 : 0
}

type OofProps = {
	content: string
}

export const oof = ({ content }: OofProps) => {
	const parserGo = new Parser()
	parserGo.setLanguage(Go)

	const parserTSX = new Parser()
	parserTSX.setLanguage(TSX)

	const parserTypeScript = new Parser()
	parserTypeScript.setLanguage(TypeScript)

	const parserPython = new Parser()
	parserPython.setLanguage(Python)

	const goScore = evaluateParser(content, Go)
	console.log(`Go: ${goScore}`)

	const typescriptScore = evaluateParser(content, TypeScript)
	console.log(`TypeScript: ${typescriptScore}`)

	const tsxScore = evaluateParser(content, TSX)
	console.log(`TSX: ${tsxScore}`)

	const pythonScore = evaluateParser(content, Python)
	console.log(`Python: ${pythonScore}`)

	// Function to print node details for debugging
	function printNode(node: Parser.SyntaxNode | null, indent = 0) {
		if (!node) return

		const { startPosition, endPosition } = node
		const nodeText = content.slice(node.startIndex, node.endIndex)

		console.log(
			`${" ".repeat(indent)}Node: ${node.type} [${startPosition.row}:${startPosition.column} - ${endPosition.row}:${endPosition.column}] Text: "${nodeText}"`
		)

		// Recursively print each child
		for (let i = 0; i < node.childCount; i++) {
			printNode(node.child(i), indent + 2)
		}
	}
}
