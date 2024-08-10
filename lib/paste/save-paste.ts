import { clientEnv } from "@/lib/env/client"
import { insertPaste } from "@/lib/fetch/paste"
import type { PasteFormSchema } from "@/lib/form"
import { encryptPasteContentToBase64 } from "@/lib/paste/encrypt-decrypt"
import type { z } from "zod"

export const savePaste = async (paste: z.infer<typeof PasteFormSchema>) => {
	if (paste.encrypted) {
		const { encryptedPayloadBase64, encryptedContentBase64 } = await encryptPasteContentToBase64({
			pasteContent: paste.content
		})

		const insertedPaste = await insertPaste({
			content: encryptedContentBase64,
			encrypted: paste.encrypted,
			oneTime: paste.oneTime,
			expiresAfter: paste.expiresAfter
		})

		return `${clientEnv.frontendUrl}/${insertedPaste.uuid}#${encryptedPayloadBase64}`
	}

	const insertedPaste = await insertPaste(paste)

	return `${clientEnv.frontendUrl}/${insertedPaste.uuid}`
}
