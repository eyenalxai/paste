import type { Paste } from "@/lib/schema"

type GetTitleProps = {
	paste: Paste
	uppercase?: boolean
}

export const getTitle = ({ paste, uppercase }: GetTitleProps) => {
	if (paste.oneTime) {
		const title = paste.ivClientBase64 !== null ? "Encrypted One-Time Paste" : "One-Time Paste"
		return uppercase ? title.toUpperCase() : title
	}

	if (paste.link) {
		const title = paste.ivClientBase64 !== null ? "Encrypted Link" : "Link"
		return uppercase ? title.toUpperCase() : title
	}

	const title = paste.ivClientBase64 !== null ? "Encrypted Paste" : "Paste"
	return uppercase ? title.toUpperCase() : title
}
