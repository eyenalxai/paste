import type Parser from "tree-sitter"

type EvaluateParserProps = {
	parser: Parser
	content: string
}

export const evaluateParser = ({ parser, content }: EvaluateParserProps) => {
	const countErrors = (node: Parser.SyntaxNode, depth = 0): number =>
		(node.isMissing ? (depth === 0 ? 8 : 4) : 0) +
		(node.hasError ? (depth === 0 ? 4 : 2) : 0) +
		Array.from({ length: node.childCount })
			.map((_, i) => node.child(i))
			.reduce((acc, child) => acc + (child ? countErrors(child) : 0), 0)

	return countErrors(parser.parse(content).rootNode)
}
