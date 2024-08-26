import { env } from "@/lib/env.mjs"

type BuildPasteUrlProps = {
	id: string
}

export const buildPasteUrl = ({ id }: BuildPasteUrlProps) => {
	return `${env.NEXT_PUBLIC_FRONTEND_URL}/${id}`
}

export const isValidUrl = (string: string) => {
	try {
		new URL(string)
		return true
	} catch (_) {
		return false
	}
}
