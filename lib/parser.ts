import type Parser from "tree-sitter"

type EvaluateParserProps = {
	parser: Parser
	content: string
}

export const evaluateParser = ({ parser, content }: EvaluateParserProps) => {
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
