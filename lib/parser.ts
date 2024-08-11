import type Parser from "tree-sitter"

type EvaluateParserProps = {
	parser: Parser
	content: string
}

export const evaluateParser = ({ parser, content }: EvaluateParserProps): number => {
	const tree = parser.parse(content)

	const countErrors = (node: Parser.SyntaxNode): number =>
		(node.isMissing ? 4 : 0) +
		(node.hasError ? 2 : 0) +
		Array.from({ length: node.childCount })
			.map((_, i) => node.child(i))
			.reduce((acc, child) => acc + (child ? countErrors(child) : 0), 0)

	return countErrors(tree.rootNode)
}
