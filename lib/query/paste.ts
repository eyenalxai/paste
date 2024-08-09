"use client"

import { getPaste } from "@/lib/fetch/paste"
import { pasteContentFromBase64 } from "@/lib/paste/encode-decode"
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

			if (!encryptedPayloadBase64) return pasteContentFromBase64(paste.content)

			return await decryptPasteContentFromBase64({
				encryptedPayloadBase64,
				encryptedContentBase64: paste.content
			})
		}
	})

	if (error) throw new Error(error.message)

	return { pasteContent, isLoading }
}
