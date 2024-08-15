import { serverDecryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { db } from "@/lib/database"
import { type Paste, pastes } from "@/lib/schema"
import { and, eq, gt } from "drizzle-orm"
import { cache } from "react"

export const selectPaste = async (uuid: string) =>
	await db
		.select()
		.from(pastes)
		.where(and(eq(pastes.uuid, uuid), gt(pastes.expiresAt, new Date().toISOString())))

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

export const getDecryptedPaste = cache(async ({ uuid, key }: GetPasteProps): Promise<GetPasteResult> => {
	const [paste] = await selectPaste(uuid)

	if (!paste) {
		return {
			paste: undefined,
			decryptedContent: undefined
		} satisfies GetPasteResult
	}

	const decryptedContent = await serverDecryptPaste({
		keyBase64: decodeURIComponent(key),
		ivServer: paste.ivServer,
		encryptedBuffer: paste.content
	})

	return {
		decryptedContent,
		paste
	} satisfies GetPasteResult
})

export const getPaste = cache(async (uuid: string) => await selectPaste(uuid))
