"use client"

import { usePaste } from "@/lib/query/paste"

type PageProps = {
	params: {
		uuid: string
	}
}

export default function Page({ params: { uuid } }: PageProps) {
	const { paste, isLoading, error } = usePaste({ uuid })

	if (error) throw new Error(error.message)
	if (isLoading || !paste) return "Loading..."

	return (
		<div>
			<div>{paste.content}</div>
		</div>
	)
}
