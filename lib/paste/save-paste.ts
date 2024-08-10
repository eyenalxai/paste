import { clientEnv } from "@/lib/env/client"
import { insertPaste } from "@/lib/fetch/paste"
import type { PasteFormSchema } from "@/lib/form"
import { pasteContentToBase64 } from "@/lib/paste/encode-decode"
import { encryptPasteContentToBase64 } from "@/lib/paste/encrypt-decrypt"
import type { z } from "zod"

export type SavePasteProps = {
	paste: Omit<z.infer<typeof PasteFormSchema>, "encrypted">
	encrypted: boolean
}

export const savePaste = async (paste: z.infer<typeof PasteFormSchema>) => {
	if (paste.encrypted) {
		const { encryptedPayloadBase64, encryptedContentBase64 } = await encryptPasteContentToBase64({
			pasteContent: paste.content
		})

		const insertedPaste = await insertPaste({
			content: encryptedContentBase64,
			oneTime: paste.oneTime,
			expiresAfter: paste.expiresAfter
		})

		return `${clientEnv.frontendUrl}/${insertedPaste.uuid}#${encryptedPayloadBase64}`
	}

	const { contentBase64 } = await pasteContentToBase64(paste.content)

	const insertedPaste = await insertPaste({
		content: contentBase64,
		oneTime: paste.oneTime,
		expiresAfter: paste.expiresAfter
	})

	return `${clientEnv.frontendUrl}/${insertedPaste.uuid}`
}
