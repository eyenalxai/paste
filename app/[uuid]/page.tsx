"use client"

import { usePaste } from "@/lib/query/paste"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type PageProps = {
	params: {
		uuid: string
	}
}

export default function Page({ params: { uuid } }: PageProps) {
	const { pasteContent, isLoading, error } = usePaste({ uuid })

	if (error) {
		toast.error(error.message)
		return null
	}

	if (isLoading || !pasteContent) return "Loading..."

	return <p className={cn("border", "p-4", "rounded")}>{pasteContent}</p>
}
