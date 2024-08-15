import { clientEncryptPaste } from "@/lib/crypto/client/encrypt-decrypt"
import { SavePasteResponseSchema, insertPaste } from "@/lib/fetch/paste"
import type { FrontendSchema } from "@/lib/form"
import type { z } from "zod"

export const savePaste = async (paste: z.infer<typeof FrontendSchema>) => {
	if (paste.encrypted) {
		const { keyBase64, ivBase64, encryptedContentBase64 } = await clientEncryptPaste(paste.content.trim())

		const { url } = SavePasteResponseSchema.parse(
			await insertPaste({
				content: encryptedContentBase64,
				contentType: paste.contentType,
				syntax: paste.syntax,
				ivClient: ivBase64,
				oneTime: paste.oneTime,
				expiresAfter: paste.expiresAfter
			})
		)

		return `${url}#${keyBase64}`
	}

	const { url } = SavePasteResponseSchema.parse(await insertPaste(paste))

	return `${url}`
}
