import type { Paste } from "@/lib/schema"

export const getTitle = (paste: Paste) => {
	if (paste.link) {
		return paste.ivClientBase64 !== null ? "ENCRYPTED LINK" : "LINK"
	}

	return paste.ivClientBase64 !== null ? "ENCRYPTED PASTE" : "PASTE"
}
