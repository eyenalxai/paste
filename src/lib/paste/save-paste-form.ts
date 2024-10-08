import { encryptPaste } from "@/lib/crypto/encrypt-decrypt"
import { savePaste } from "@/lib/fetch/paste"
import { createFile } from "@/lib/file"
import { SavePasteResponseSchema } from "@/lib/zod/form/common"
import type { FrontendSchema } from "@/lib/zod/form/frontend"
import { parseZodSchema } from "@/lib/zod/parse"
import { type ResultAsync, ok } from "neverthrow"
import type { z } from "zod"

export const savePasteForm = (
	paste: z.infer<typeof FrontendSchema>
): ResultAsync<z.infer<typeof SavePasteResponseSchema>, string> => {
	if (paste.encrypted) {
		return encryptPaste(paste.content).andThen(({ keyBase64, ivBase64, encryptedContentBase64 }) =>
			createFile(encryptedContentBase64, "paste-encrypted").asyncAndThen((contentBlob) =>
				savePaste({
					contentBlob: contentBlob,
					contentType: paste.contentType,
					syntax: paste.syntax,
					ivClient: ivBase64,
					oneTime: paste.oneTime,
					expiresAfter: paste.expiresAfter
				}).andThen((response) =>
					parseZodSchema(SavePasteResponseSchema, response).andThen(({ id, url, syntax }) =>
						ok({ id, url: `${url}#${keyBase64}`, syntax })
					)
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
		}).andThen((response) =>
			parseZodSchema(SavePasteResponseSchema, response).andThen(({ id, url, syntax }) =>
				ok({ id, url: `${url}`, syntax })
			)
		)
	)
}
