"use client"

import { usePaste } from "@/lib/query/paste"
import { cn } from "@/lib/utils"
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

	return <p className={cn("border", "p-4", "rounded", "font-mono")}>{pasteContent}</p>
}
