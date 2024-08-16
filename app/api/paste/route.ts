import { contentLength } from "@/lib/content-length"
import { serverFileToBuffer } from "@/lib/crypto/server/encode-decode"
import { serverEncryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { getExpiresAt } from "@/lib/date"
import { BackendSchema } from "@/lib/form"
import { insertPaste } from "@/lib/select"
import { getPasteSyntax } from "@/lib/syntax/detect"
import { buildPasteUrl } from "@/lib/url"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
	const badContentLengthResponse = await contentLength(request)
	if (badContentLengthResponse) return badContentLengthResponse

	const { ivClient, contentBlob, oneTime, expiresAfter, contentType, syntax } = BackendSchema.parse(
		await request.formData()
	)

	const content = await contentBlob.text()

	const pasteSyntax = await getPasteSyntax({
		encrypted: ivClient !== undefined,
		syntax: syntax,
		contentType: contentType,
		content: content
	})

	if (!ivClient) {
		const { keyBase64, ivServer, encryptedBuffer } = await serverEncryptPaste(content)

		const insertedPaste = await insertPaste({
			content: encryptedBuffer,
			syntax: pasteSyntax,
			ivClientBase64: ivClient,
			ivServer: ivServer,
			oneTime: oneTime,
			expiresAt: getExpiresAt(expiresAfter).toISOString(),
			link: contentType === "link"
		})

		return NextResponse.json({
			url: buildPasteUrl({ id: insertedPaste.id, keyBase64 })
		})
	}

	const insertedPaste = await insertPaste({
		content: await serverFileToBuffer(contentBlob),
		syntax: pasteSyntax,
		ivClientBase64: ivClient,
		ivServer: null,
		oneTime: oneTime,
		expiresAt: getExpiresAt(expiresAfter).toISOString(),
		link: contentType === "link"
	})

	return NextResponse.json({
		url: buildPasteUrl({ id: insertedPaste.id })
	})
}
