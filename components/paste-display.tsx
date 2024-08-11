"use client"

import { PasteContainer } from "@/components/paste-container"
import { Alert } from "@/components/ui/alert"
import { usePaste } from "@/lib/query/paste"
import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"

type PasteDisplayProps = {
	uuid: string
}

export const PasteDisplay = ({ uuid }: PasteDisplayProps) => {
	const { pasteContent, isLoading, error } = usePaste({ uuid })

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
