"use client"

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote"

type RemoteMdxProps = {
	mdxSource: MDXRemoteSerializeResult
}

export function RemoteMdx({ mdxSource }: RemoteMdxProps) {
	return <MDXRemote {...mdxSource} />
}
