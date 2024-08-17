import { contentLength } from "@/lib/content-length"
import { serverFileToBuffer } from "@/lib/crypto/server/encode-decode"
import { serverEncryptPaste } from "@/lib/crypto/server/encrypt-decrypt"
import { insertPaste } from "@/lib/database/insert"
import { getExpiresAt } from "@/lib/date"
import { getPasteSyntax } from "@/lib/syntax/detect"
import { buildPasteUrl } from "@/lib/url"
import { BackendSchema } from "@/lib/zod/form/backend"
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
		if (contentType === "link") {
			return serverFileToBuffer(contentBlob)
				.andThen((buffer) =>
					insertPaste({
						content: buffer,
						syntax: pasteSyntax,
						ivClientBase64: null,
						ivServer: null,
						oneTime: oneTime,
						expiresAt: getExpiresAt(expiresAfter).toISOString(),
						link: true
					})
				)
				.match(
					(insertedPaste) =>
						NextResponse.json({
							url: buildPasteUrl({ id: insertedPaste.id })
						}),
					(error) => new NextResponse(error, { status: 500 })
				)
		}

		return serverEncryptPaste(content)
			.andThen(({ keyBase64, ivServer, encryptedBuffer }) =>
				insertPaste({
					content: encryptedBuffer,
					syntax: pasteSyntax,
					ivClientBase64: null,
					ivServer: ivServer,
					oneTime: oneTime,
					expiresAt: getExpiresAt(expiresAfter).toISOString(),
					link: false
				}).map((insertedPaste) => ({
					insertedPaste,
					keyBase64
				}))
			)
			.match(
				({ insertedPaste, keyBase64 }) =>
					NextResponse.json({
						url: buildPasteUrl({ id: insertedPaste.id, keyBase64 })
					}),
				(error) => new NextResponse(error, { status: 500 })
			)
	}

	return serverFileToBuffer(contentBlob)
		.andThen((buffer) =>
			insertPaste({
				content: buffer,
				syntax: pasteSyntax,
				ivClientBase64: ivClient,
				ivServer: null,
				oneTime: oneTime,
				expiresAt: getExpiresAt(expiresAfter).toISOString(),
				link: contentType === "link"
			})
		)
		.match(
			(insertedPaste) =>
				NextResponse.json({
					url: buildPasteUrl({ id: insertedPaste.id })
				}),
			(error) => new NextResponse(error, { status: 500 })
		)
}
