import type { Paste } from "@/lib/schema"

export const getImageTitle = (paste: Paste) => {
	if (paste.link) {
		return paste.ivBase64 !== null ? "ENCRYPTED LINK" : "LINK"
	}

	return paste.ivBase64 !== null ? "ENCRYPTED PASTE" : "PASTE"
}
