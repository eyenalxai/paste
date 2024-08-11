"use client"

import { PasteContainer } from "@/components/paste-container"
import { usePaste } from "@/lib/query/paste"
import { toast } from "sonner"

type PasteDisplayProps = {
	uuid: string
}

export const PasteDisplay = ({ uuid }: PasteDisplayProps) => {
	const { pasteContent, isLoading, error } = usePaste({ uuid })

	if (error) {
		toast.error(error.message)
		return null
	}

	if (isLoading || !pasteContent) return "Loading..."

	return <PasteContainer>{pasteContent}</PasteContainer>
}
