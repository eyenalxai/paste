import { PasteContainer } from "@/components/paste-container"

import type { VFile } from "vfile"

type ServerPasteDisplayProps = {
	id: string
	markdown: VFile
	oneTime: boolean
	decryptedContent: string
	keyBase64: string
}

export const ServerPasteDisplay = ({ id, markdown, oneTime, decryptedContent, keyBase64 }: ServerPasteDisplayProps) => {
	return (
		<PasteContainer
			markdown={markdown}
			content={decryptedContent}
			oneTime={oneTime}
			id={id}
			serverKeyBase64={keyBase64}
			noWrap
		/>
	)
}
