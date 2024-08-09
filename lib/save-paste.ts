import { encryptPasteContentToBase64 } from "@/lib/crypto"
import { clientEnv } from "@/lib/env/client"
import { insertPaste } from "@/lib/fetch/paste"
import type { PasteFormSchema } from "@/lib/form"
import type { z } from "zod"

export const savePaste = async (data: z.infer<typeof PasteFormSchema>) => {
	if (data.encrypted) {
		const { encryptedPayloadBase64, encryptedDataBase64 } = await encryptPasteContentToBase64({
			secretData: data.content
		})

		const insertedPaste = await insertPaste({
			content: encryptedDataBase64
		})

		return `${clientEnv.frontendUrl}/${insertedPaste.uuid}#${encryptedPayloadBase64}`
	}

	const insertedPaste = await insertPaste({
		content: window.btoa(data.content)
	})

	return `${clientEnv.frontendUrl}/${insertedPaste.uuid}`
}
