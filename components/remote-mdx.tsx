import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeHighlight from "rehype-highlight"

type RemoteMdxProps = {
	source: string
}

export function RemoteMdx({ source }: RemoteMdxProps) {
	return (
		<MDXRemote
			source={source}
			options={{
				mdxOptions: { rehypePlugins: [rehypeHighlight] }
			}}
		/>
	)
}
