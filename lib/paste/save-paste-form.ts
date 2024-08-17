import { clientEncryptPaste } from "@/lib/crypto/client/encrypt-decrypt"
import { SavePasteResponseSchema, savePaste } from "@/lib/fetch/paste"
import { createFile } from "@/lib/file"
import type { FrontendSchema } from "@/lib/form"
import { parseZodSchema } from "@/lib/zod/parse"
import { ok } from "neverthrow"
import type { z } from "zod"

export const savePasteForm = (paste: z.infer<typeof FrontendSchema>) => {
	if (paste.encrypted) {
		clientEncryptPaste(paste.content).andThen(({ keyBase64, ivBase64, encryptedContentBase64 }) =>
			createFile(encryptedContentBase64, "paste-encrypted").asyncAndThen((contentBlob) =>
				savePaste({
					contentBlob: contentBlob,
					contentType: paste.contentType,
					syntax: paste.syntax,
					ivClient: ivBase64,
					oneTime: paste.oneTime,
					expiresAfter: paste.expiresAfter
				}).andThen((response) =>
					parseZodSchema(SavePasteResponseSchema, response).andThen(({ url }) => ok(`${url}#${keyBase64}`))
				)
			)
		)
	}

	return createFile(paste.content, "paste").asyncAndThen((contentBlob) =>
		savePaste({
			contentBlob: contentBlob,
			contentType: paste.contentType,
			syntax: paste.syntax,
			ivClient: undefined,
			oneTime: paste.oneTime,
			expiresAfter: paste.expiresAfter
		}).andThen((response) => parseZodSchema(SavePasteResponseSchema, response).andThen(({ url }) => ok(`${url}`)))
	)
}
