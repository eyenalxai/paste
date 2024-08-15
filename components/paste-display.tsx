"use client"

import { PasteContainer } from "@/components/paste-container"
import { Alert } from "@/components/ui/alert"
import { usePaste } from "@/lib/query/paste"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

type PasteDisplayProps = {
	uuid: string
	ivClientBase64: string
	clientEncryptedContent: string
	link: boolean
	syntax: string
	extension: string | undefined
}

export const PasteDisplay = ({
	uuid,
	ivClientBase64,
	clientEncryptedContent,
	link,
	syntax,
	extension
}: PasteDisplayProps) => {
	const { paste, isLoading, error } = usePaste({
		uuid,
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
		return (
			<PasteContainer loading>
				<div className={cn("w-full", "flex", "justify-start")}>
					<Alert
						variant="destructive"
						title="Error"
						className={cn("border", "border-red-500", "font-semibold", "text-lg", "w-fit")}
					>
						{error.message}
					</Alert>
				</div>
			</PasteContainer>
		)
	}

	if (isLoading || !paste) return <PasteContainer loading />

	return <PasteContainer noWrap content={paste.rawContent} markdown={paste.markdownContent} />
}
