import { clientEncryptPaste } from "@/lib/crypto/client/encrypt-decrypt"
import { SavePasteResponseSchema, savePaste } from "@/lib/fetch/paste"
import type { FrontendSchema } from "@/lib/form"
import type { z } from "zod"

export const savePasteForm = async (paste: z.infer<typeof FrontendSchema>) => {
	if (paste.encrypted) {
		const { keyBase64, ivBase64, encryptedContentBase64 } = await clientEncryptPaste(paste.content)

		const contentBlob = new File([encryptedContentBase64], "paste-encrypted", { type: "text/plain" })

		const { url } = SavePasteResponseSchema.parse(
			await savePaste({
				contentBlob: contentBlob,
				contentType: paste.contentType,
				syntax: paste.syntax,
				ivClient: ivBase64,
				oneTime: paste.oneTime,
				expiresAfter: paste.expiresAfter
			})
		)

		return `${url}#${keyBase64}`
	}

	const contentBlob = new File([paste.content], "paste", { type: "text/plain" })

	const { url } = SavePasteResponseSchema.parse(
		await savePaste({
			contentBlob: contentBlob,
			contentType: paste.contentType,
			syntax: paste.syntax,
			ivClient: undefined,
			oneTime: paste.oneTime,
			expiresAfter: paste.expiresAfter
		})
	)

	return `${url}`
}
