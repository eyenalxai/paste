import type Parser from "tree-sitter"

const getNodeErrorScore = (node: Parser.SyntaxNode, depth = 0): number => {
	if (node.isMissing) return depth === 0 ? 40 : 10
	if (node.isError || node.hasError) return depth === 0 ? 20 : 5
	return 0
}

type EvaluateParserProps = {
	parser: Parser
	content: string
}

export const evaluateParser = ({ parser, content }: EvaluateParserProps) => {
	const countErrors = (node: Parser.SyntaxNode, depth = 0): number =>
		getNodeErrorScore(node, depth) +
		Array.from({ length: node.childCount })
			.map((_, i) => node.child(i))
			.reduce((acc, child) => acc + (child ? countErrors(child) : 0), 0)

	return countErrors(parser.parse(content).rootNode)
}
