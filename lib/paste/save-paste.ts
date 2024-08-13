import { clientEnv } from "@/lib/env/client"
import { insertPaste } from "@/lib/fetch/paste"
import type { PasteFormSchema } from "@/lib/form"
import { encryptPasteContentToBase64 } from "@/lib/paste/encrypt-decrypt"
import type { z } from "zod"

export const savePaste = async (paste: z.infer<typeof PasteFormSchema>) => {
	if (paste.encrypted) {
		const { keyBase64, ivBase64, encryptedContentBase64 } = await encryptPasteContentToBase64({
			pasteContent: paste.content
		})

		const insertedPaste = await insertPaste({
			content: encryptedContentBase64,
			contentType: paste.contentType,
			syntax: paste.syntax,
			iv: ivBase64,
			oneTime: paste.oneTime,
			expiresAfter: paste.expiresAfter
		})

		return `${clientEnv.frontendUrl}/${insertedPaste.uuid}#${keyBase64}`
	}

	const insertedPaste = await insertPaste(paste)

	return `${clientEnv.frontendUrl}/${insertedPaste.uuid}`
}
