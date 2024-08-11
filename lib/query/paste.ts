"use client"

import { fetchPaste } from "@/lib/fetch/paste"
import { decryptPasteContentFromBase64 } from "@/lib/paste/encrypt-decrypt"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

type UsePasteProps = {
	uuid: string
}

export const usePaste = ({ uuid }: UsePasteProps) => {
	const [keyBase64] = useState(
		typeof window !== "undefined" && window.location.hash ? window.location.hash.slice(1) : undefined
	)

	const {
		data: pasteContent,
		isLoading,
		error
	} = useQuery({
		queryKey: ["paste", uuid],
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		refetchOnReconnect: false,
		queryFn: async () => {
			if (!keyBase64) throw new Error("Missing encrypted payload")

			const paste = await fetchPaste(uuid)

			if (!paste.ivBase64) throw new Error("Missing initialization vector")

			return await decryptPasteContentFromBase64({
				keyBase64,
				ivBase64: paste.ivBase64,
				encryptedContentBase64: paste.content
			})
		}
	})

	return { pasteContent, isLoading, error }
}
