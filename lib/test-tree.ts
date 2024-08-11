import Parser from "tree-sitter"
import Go from "tree-sitter-go"

import Python from "tree-sitter-python"

const TSX = require("tree-sitter-typescript").tsx
const TypeScript = require("tree-sitter-typescript").typescript

type EvaluateParserProps = {
	parser: Parser
	content: string
}

function evaluateParser({ parser, content }: EvaluateParserProps) {
	const tree = parser.parse(content)

	const countNodes = (
		node: Parser.SyntaxNode,
		counts: { total: number; errors: number }
	): { total: number; errors: number } => {
		counts.total++

		if (node.hasError || node.isMissing) {
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

	const { total, errors } = countNodes(tree.rootNode, {
		total: 0,
		errors: 0
	})

	const errorPenalty = 4

	return total > 0 ? ((total - errors * errorPenalty) / total) * 100 : 0
}

type OofProps = {
	content: string
}

export const oof = ({ content }: OofProps) => {
	const parserGo = new Parser()
	parserGo.setLanguage(Go)

	const parserTypeScript = new Parser()
	parserTypeScript.setLanguage(TypeScript)

	const parserTSX = new Parser()
	parserTSX.setLanguage(TSX)

	const parserPython = new Parser()
	parserPython.setLanguage(Python)

	const goScore = evaluateParser({ parser: parserGo, content })
	console.log(`Go: ${goScore}`)

	const typescriptScore = evaluateParser({ parser: parserTypeScript, content })
	console.log(`TypeScript: ${typescriptScore}`)

	const tsxScore = evaluateParser({ parser: parserTSX, content })
	console.log(`TSX: ${tsxScore}`)

	const pythonScore = evaluateParser({ parser: parserPython, content })
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

	console.log("\nTSX Parse Tree:")
	// printNode(parserTSX.parse(content).rootNode)
}
