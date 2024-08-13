"use client"

import { fetchPaste } from "@/lib/fetch/paste"
import { wrapInMarkdown } from "@/lib/markdown"
import { decryptPasteContentFromBase64 } from "@/lib/paste/encrypt-decrypt"
import type { AllSyntax } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import rehypeHighlight from "rehype-highlight"
import rehypeSanitize from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

type UsePasteProps = {
	uuid: string
	syntax: AllSyntax | null
	extension: string | undefined
}

export const usePaste = ({ uuid, syntax, extension }: UsePasteProps) => {
	const [keyBase64] = useState(
		typeof window !== "undefined" && window.location.hash ? window.location.hash.slice(1) : undefined
	)

	const {
		data: paste,
		isLoading,
		error
	} = useQuery({
		queryKey: ["paste", uuid],
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		refetchOnReconnect: false,
		queryFn: async () => {
			if (!keyBase64) throw new Error("Missing encrypted payload")

			const paste = await fetchPaste(uuid)

			if (!paste.ivBase64) throw new Error("Missing initialization vector")

			const rawContent = await decryptPasteContentFromBase64({
				keyBase64,
				ivBase64: paste.ivBase64,
				encryptedContentBase64: paste.content
			})

			const markdownContent = await unified()
				.use(remarkParse)
				.use(remarkRehype)
				.use(rehypeSanitize)
				.use(rehypeStringify)
				.use(rehypeHighlight)
				.process(wrapInMarkdown({ syntax, extension, content: rawContent }))

			return {
				markdownContent: markdownContent,
				rawContent
			}
		}
	})

	return { paste, isLoading, error }
}
