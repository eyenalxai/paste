"use client"

import { PasteContainer } from "@/components/paste-container"
import { usePaste } from "@/lib/query/paste"
import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"
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

	if (isLoading || !pasteContent)
		return (
			<PasteContainer loading>
				<div className={cn("w-full", "flex", "justify-start")}>
					<Loader className={cn("animate-spin")} />
				</div>
			</PasteContainer>
		)

	return <PasteContainer content={pasteContent}>{pasteContent}</PasteContainer>
}
