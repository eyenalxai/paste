"use client"

import { clientDecryptPaste } from "@/lib/crypto/client/encrypt-decrypt"
import { toMarkdown, wrapInMarkdown } from "@/lib/markdown"
import { all } from "lowlight"
import { type Result, err, ok } from "neverthrow"
import { useEffect, useState } from "react"
import rehypeHighlight from "rehype-highlight"
import rehypeSanitize from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import type { VFile } from "vfile"

type UsePasteReturn =
	| {
			result: Result<PasteData, string>
			isLoading: false
	  }
	| {
			result: null
			isLoading: true
	  }

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

export const useDecryptPaste = ({
	ivClientBase64,
	clientEncryptedContent,
	link,
	syntax,
	extension
}: UsePasteProps): UsePasteReturn => {
	const [result, setResult] = useState<Result<PasteData, string> | null>(null)

	useEffect(() => {
		const keyBase64 = window.location.hash ? window.location.hash.slice(1) : undefined

		if (!keyBase64) {
			setResult(err("Missing decryption key in hash (#) part of URL"))
			return
		}

		clientDecryptPaste({
			keyBase64,
			ivBase64: ivClientBase64,
			encryptedContentBase64: clientEncryptedContent
		})
			.andThen((rawContent) =>
				toMarkdown({ syntax, extension, rawContent }).map((markdownContent) =>
					setResult(ok({ markdownContent, rawContent, link }))
				)
			)
			.mapErr((error) => setResult(err(error)))
	}, [ivClientBase64, clientEncryptedContent, link, syntax, extension])

	if (!result) return { result: null, isLoading: true }
	return { result, isLoading: false }
}
