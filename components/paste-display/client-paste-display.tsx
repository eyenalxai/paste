"use client"

import { PasteError } from "@/components/error/paste-error"
import { PasteContainer } from "@/components/paste-container"
import { useDecryptPaste } from "@/lib/hooks/decrypt-paste"
import { useEffect } from "react"

type PasteDisplayProps = {
	ivClientBase64: string
	clientEncryptedContent: string
	link: boolean
	syntax: string
	extension: string | undefined
}

export const ClientPasteDisplay = ({
	ivClientBase64,
	clientEncryptedContent,
	link,
	syntax,
	extension
}: PasteDisplayProps) => {
	const { result, isLoading } = useDecryptPaste({
		ivClientBase64,
		clientEncryptedContent,
		link,
		syntax,
		extension
	})

	useEffect(() => {
		if (!result) return

		result.match(
			(paste) => {
				if (paste.link) {
					window.location.href = paste.rawContent
				}
			},
			() => null
		)
	}, [result])

	if (isLoading) return <PasteContainer loading />

	return result.match(
		(paste) => <PasteContainer noWrap content={paste.rawContent} markdown={paste.markdownContent} />,
		(error) => <PasteError title={"Something went wrong"} description={error} />
	)
}
