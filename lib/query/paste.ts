"use client"

import { clientDecryptPaste } from "@/lib/crypto/client/encrypt-decrypt"
import { wrapInMarkdown } from "@/lib/markdown"
import { all } from "lowlight"
import { useEffect, useState } from "react"
import rehypeHighlight from "rehype-highlight"
import rehypeSanitize from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import type { VFile } from "vfile"

type UsePasteProps = {
	ivClientBase64: string
	clientEncryptedContent: string
	link: boolean
	syntax: string
	extension: string | undefined
}

type PasteData = {
	markdownContent: VFile
	rawContent: string
	link: boolean
}

export const usePaste = ({ ivClientBase64, clientEncryptedContent, link, syntax, extension }: UsePasteProps) => {
	const [paste, setPaste] = useState<PasteData | null>(null)
	const [isLoading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		setLoading(true)

		const keyBase64 = window.location.hash ? window.location.hash.slice(1) : undefined

		if (!keyBase64) {
			setError(new Error("Missing encrypted payload"))
			return
		}

		clientDecryptPaste({
			keyBase64,
			ivBase64: ivClientBase64,
			encryptedContentBase64: clientEncryptedContent
		})
			.then(async (rawContent) => {
				const markdownContent = await unified()
					.use(remarkParse)
					.use(remarkRehype)
					.use(rehypeSanitize)
					.use(rehypeStringify)
					.use(rehypeHighlight, { languages: all })
					.process(wrapInMarkdown({ syntax, extension, content: rawContent }))
				setPaste({
					markdownContent: markdownContent,
					rawContent,
					link
				})
			})
			.catch((e) => {
				setError(e instanceof Error ? e : new Error("An error occurred"))
			})
			.finally(() => setLoading(false))
	}, [ivClientBase64, clientEncryptedContent, link, syntax, extension])

	return { paste, isLoading, error }
}
