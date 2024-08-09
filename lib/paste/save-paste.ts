import { clientEnv } from "@/lib/env/client"
import { insertPaste } from "@/lib/fetch/paste"
import { pasteContentToBase64 } from "@/lib/paste/encode-decode"
import { encryptPasteContentToBase64 } from "@/lib/paste/encrypt-decrypt"
import type { PasteInsert } from "@/lib/schema"

type SavePasteProps = {
	paste: PasteInsert
	encrypted: boolean
}

export const savePaste = async ({ paste, encrypted }: SavePasteProps) => {
	if (encrypted) {
		const { encryptedPayloadBase64, encryptedContentBase64 } = await encryptPasteContentToBase64({
			pasteContent: paste.content
		})

		const insertedPaste = await insertPaste({
			content: encryptedContentBase64,
			oneTime: paste.oneTime
		})

		return `${clientEnv.frontendUrl}/${insertedPaste.uuid}#${encryptedPayloadBase64}`
	}

	const { contentBase64 } = await pasteContentToBase64(paste.content)

	const insertedPaste = await insertPaste({
		content: contentBase64,
		oneTime: paste.oneTime
	})

	return `${clientEnv.frontendUrl}/${insertedPaste.uuid}`
}
