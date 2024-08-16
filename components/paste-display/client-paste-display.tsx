"use client"

import { PasteError } from "@/components/error/paste-error"
import { PasteContainer } from "@/components/paste-container"
import { Alert } from "@/components/ui/alert"
import { usePaste } from "@/lib/query/paste"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

type PasteDisplayProps = {
	id: string
	ivClientBase64: string
	clientEncryptedContent: string
	link: boolean
	syntax: string
	extension: string | undefined
}

export const ClientPasteDisplay = ({
	id,
	ivClientBase64,
	clientEncryptedContent,
	link,
	syntax,
	extension
}: PasteDisplayProps) => {
	const { paste, isLoading, error } = usePaste({
		id,
		ivClientBase64,
		clientEncryptedContent,
		link,
		syntax,
		extension
	})

	useEffect(() => {
		if (!paste) return

		if (paste.link) {
			window.location.href = paste.rawContent
		}
	}, [paste])

	if (error) {
		return <PasteError title={"Something went wrong"} description={error.message} />
	}

	if (isLoading || !paste) return <PasteContainer loading />

	return <PasteContainer noWrap content={paste.rawContent} markdown={paste.markdownContent} />
}
