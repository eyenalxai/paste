import { cn } from "@/lib/utils"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeHighlight from "rehype-highlight"

type RemoteMdxProps = {
	source: string
}

export function RemoteMdx({ source }: RemoteMdxProps) {
	return (
		<article className={cn("prose", "prose-slate", "dark:prose-invert", "max-w-max")}>
			<MDXRemote
				source={source}
				options={{
					mdxOptions: { rehypePlugins: [rehypeHighlight] }
				}}
			/>
		</article>
	)
}
