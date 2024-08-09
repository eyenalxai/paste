"use client"

import { usePaste } from "@/lib/query/paste"
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
		return
	}

	if (isLoading || !pasteContent) return "Loading..."

	return (
		<div>
			<div>{pasteContent}</div>
		</div>
	)
}
