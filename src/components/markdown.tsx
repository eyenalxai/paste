import { cn } from "@/lib/utils"
import { all } from "lowlight"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import rehypeSanitize from "rehype-sanitize"
import remarkMath from "remark-math"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"

type MarkdownDisplayProps = {
	markdown: string
}

export const MarkdownDisplay = ({ markdown }: MarkdownDisplayProps) => (
	<article className={cn("prose", "prose-slate", "dark:prose-invert", "max-w-max")}>
		<Markdown
			remarkPlugins={[remarkParse, remarkMath, remarkRehype]}
			rehypePlugins={[rehypeSanitize, rehypeKatex, [rehypeHighlight, { languages: all }]]}
		>
			{markdown}
		</Markdown>
	</article>
)
