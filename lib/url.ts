type BuildPasteUrlProps = {
	id: string
	keyBase64?: string
}

export const buildPasteUrl = ({ id, keyBase64 }: BuildPasteUrlProps) => {
	if (!keyBase64) return `https://oof.com/${id}`

	return `https://oof.com/${id}?key=${encodeURIComponent(keyBase64)}`
}
