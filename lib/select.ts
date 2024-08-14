import { serverDecryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { db } from "@/lib/database"
import { type Paste, pastes } from "@/lib/schema"
import { and, eq, gt } from "drizzle-orm"
import { cache } from "react"

type GetPasteProps = {
	uuid: string
	key: string
}

type GetPasteResult =
	| {
			paste: undefined
			decryptedContent: undefined
	  }
	| {
			paste: Paste
			decryptedContent: string
	  }

export const getPaste = cache(async ({ uuid, key }: GetPasteProps): Promise<GetPasteResult> => {
	const [paste] = await db
		.select()
		.from(pastes)
		.where(and(eq(pastes.uuid, uuid), gt(pastes.expiresAt, new Date().toISOString())))

	if (!paste) {
		return {
			paste: undefined,
			decryptedContent: undefined
		} satisfies GetPasteResult
	}

	const decryptedContent = await serverDecryptPaste({
		keyBase64: decodeURIComponent(key),
		ivBase64: paste.ivServerBase64,
		encryptedContentBase64: paste.content
	})

	return {
		decryptedContent,
		paste
	} satisfies GetPasteResult
})
