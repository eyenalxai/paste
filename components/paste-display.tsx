"use client"

import { PasteContainer } from "@/components/paste-container"
import { Alert } from "@/components/ui/alert"
import { usePaste } from "@/lib/query/paste"
import type { AllSyntax } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"
import { useEffect } from "react"

type PasteDisplayProps = {
	uuid: string
	syntax: AllSyntax | null
	extension: string | undefined
}

export const PasteDisplay = ({ uuid, syntax, extension }: PasteDisplayProps) => {
	const { paste, isLoading, error } = usePaste({ uuid, syntax, extension })

	useEffect(() => {
		if (paste?.link) {
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

	if (isLoading || !paste)
		return (
			<PasteContainer loading>
				<div className={cn("w-full", "flex", "justify-start")}>
					<Loader className={cn("animate-spin")} />
				</div>
			</PasteContainer>
		)

	return <PasteContainer noWrap content={paste.rawContent} markdown={paste.markdownContent} />
}
