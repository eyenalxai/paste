import type { Paste } from "@/lib/schema"

export const getImageTitle = (paste: Paste) => {
	if (paste.link) {
		return paste.ivBase64 !== null ? "Encrypted link" : "Link"
	}

	return paste.ivBase64 !== null ? "Encrypted paste" : "Paste"
}
