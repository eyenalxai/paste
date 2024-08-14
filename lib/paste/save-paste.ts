import { env } from "@/lib/env.mjs"
import { insertPaste } from "@/lib/fetch/paste"
import type { PasteFormSchema } from "@/lib/form"
import { clientEncryptPaste } from "@/lib/paste/encrypt-decrypt"
import type { z } from "zod"

export const savePaste = async (paste: z.infer<typeof PasteFormSchema>) => {
	if (paste.encrypted) {
		const { keyBase64, ivBase64, encryptedContentBase64 } = await clientEncryptPaste({
			pasteContent: paste.content.trim()
		})

		const insertedPaste = await insertPaste({
			content: encryptedContentBase64,
			contentType: paste.contentType,
			syntax: paste.syntax,
			ivClient: ivBase64,
			oneTime: paste.oneTime,
			expiresAfter: paste.expiresAfter
		})

		return `${env.NEXT_PUBLIC_FRONTEND_URL}/${insertedPaste.uuid}#${keyBase64}`
	}

	const insertedPaste = await insertPaste(paste)

	return `${env.NEXT_PUBLIC_FRONTEND_URL}/${insertedPaste.uuid}`
}
