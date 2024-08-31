import { PasteContainer } from "@/components/paste-container"

type ServerPasteDisplayProps = {
	id: string
	markdown: string
	oneTime: boolean
	decryptedContent: string
}

export const ServerPasteDisplay = ({ id, markdown, oneTime, decryptedContent }: ServerPasteDisplayProps) => {
	return <PasteContainer markdown={markdown} content={decryptedContent} oneTime={oneTime} id={id} noWrap />
}
