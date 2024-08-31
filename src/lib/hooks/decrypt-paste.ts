"use client"

import { clientDecryptPaste } from "@/lib/crypto/encrypt-decrypt"
import { wrapInMarkdown } from "@/lib/markdown"
import { type Result, err, ok } from "neverthrow"
import { useEffect, useState } from "react"

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
	markdownContent: string
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
			.map((rawContent) =>
				setResult(ok({ markdownContent: wrapInMarkdown({ syntax, extension, content: rawContent }), rawContent, link }))
			)
			.mapErr((error) => setResult(err(error)))
	}, [ivClientBase64, clientEncryptedContent, link, syntax, extension])

	if (!result) return { result: null, isLoading: true }
	return { result, isLoading: false }
}
