"use client"

import { getPaste } from "@/lib/fetch/paste"
import { decryptPasteContentFromBase64 } from "@/lib/paste/encrypt-decrypt"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

type UsePasteProps = {
	uuid: string
}

export const usePaste = ({ uuid }: UsePasteProps) => {
	const [encryptedPayloadBase64] = useState(
		typeof window !== "undefined" && window.location.hash ? window.location.hash.slice(1) : undefined
	)

	const {
		data: pasteContent,
		isLoading,
		error
	} = useQuery({
		queryKey: ["paste", uuid],
		queryFn: async () => {
			const paste = await getPaste(uuid)

			if (!paste.encrypted) return paste.content

			if (!encryptedPayloadBase64) throw new Error("Missing encrypted payload")

			return await decryptPasteContentFromBase64({
				encryptedPayloadBase64,
				encryptedContentBase64: paste.content
			})
		}
	})

	return { pasteContent, isLoading, error }
}
