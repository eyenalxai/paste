import { env } from "@/lib/env.mjs"

type BuildPasteUrlProps = {
	uuid: string
	keyBase64: string
}

export const buildPasteUrl = ({ uuid, keyBase64 }: BuildPasteUrlProps) => {
	return `${env.NEXT_PUBLIC_FRONTEND_URL}/${uuid}?key=${encodeURIComponent(keyBase64)}`
}

export const isValidUrl = (string: string) => {
	try {
		new URL(string)
		return true
	} catch (_) {
		return false
	}
}
