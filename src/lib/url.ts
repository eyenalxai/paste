import { env } from "@/lib/env.mjs"

type BuildPasteUrlProps = {
	id: string
	keyBase64?: string
}

export const buildPasteUrl = ({ id, keyBase64 }: BuildPasteUrlProps) => {
	if (!keyBase64) return `${env.NEXT_PUBLIC_FRONTEND_URL}/${id}`

	return `${env.NEXT_PUBLIC_FRONTEND_URL}/${id}?key=${encodeURIComponent(keyBase64)}`
}

export const isValidUrl = (string: string) => {
	try {
		new URL(string)
		return true
	} catch (_) {
		return false
	}
}
