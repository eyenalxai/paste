import { encryptPasteContentToBase64, pasteContentToBase64 } from "@/lib/crypto"
import { clientEnv } from "@/lib/env/client"
import { insertPaste } from "@/lib/fetch/paste"
import type { PasteFormSchema } from "@/lib/form"
import type { z } from "zod"

export const savePaste = async (data: z.infer<typeof PasteFormSchema>) => {
	if (data.encrypted) {
		const { encryptedPayloadBase64, encryptedContentBase64 } = await encryptPasteContentToBase64({
			pasteContent: data.content
		})

		const insertedPaste = await insertPaste({
			content: encryptedContentBase64
		})

		return `${clientEnv.frontendUrl}/${insertedPaste.uuid}#${encryptedPayloadBase64}`
	}

	const { contentBase64 } = await pasteContentToBase64(data.content)

	const insertedPaste = await insertPaste({
		content: contentBase64
	})

	return `${clientEnv.frontendUrl}/${insertedPaste.uuid}`
}
