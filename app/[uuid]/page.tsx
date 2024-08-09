"use client"

import { usePaste } from "@/lib/query/paste"

type PageProps = {
	params: {
		uuid: string
	}
}

export default function Page({ params: { uuid } }: PageProps) {
	const { pasteContent, isLoading } = usePaste({ uuid })

	if (isLoading || !pasteContent) return "Loading..."

	return (
		<div>
			<div>{pasteContent}</div>
		</div>
	)
}
