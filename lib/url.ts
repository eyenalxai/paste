import { env } from "@/lib/env.mjs"

export const buildPasteUrl = (uuid: string) => {
	return `${env.NEXT_PUBLIC_FRONTEND_URL}/${uuid}`
}

export const isValidUrl = (string: string) => {
	try {
		new URL(string)
		return true
	} catch (_) {
		return false
	}
}
