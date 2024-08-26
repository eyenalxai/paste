import { PasteContainer } from "@/components/paste-container"

import type { VFile } from "vfile"

type ServerPasteDisplayProps = {
	id: string
	markdown: VFile
	oneTime: boolean
	decryptedContent: string
}

export const ServerPasteDisplay = ({ id, markdown, oneTime, decryptedContent }: ServerPasteDisplayProps) => {
	return <PasteContainer markdown={markdown} content={decryptedContent} oneTime={oneTime} id={id} noWrap />
}
