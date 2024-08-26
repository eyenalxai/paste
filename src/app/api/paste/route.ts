import { contentLength } from "@/lib/content-length"
import { insertPaste } from "@/lib/database/insert"
import { getExpiresAt } from "@/lib/date"
import { getPasteSyntax } from "@/lib/syntax/detect"
import { buildPasteUrl } from "@/lib/url"
import { BackendSchema } from "@/lib/zod/form/backend"
import { SavePasteResponseSchema } from "@/lib/zod/form/common"
import { parseZodFormDataSchema, parseZodSchema } from "@/lib/zod/parse"
import { NextResponse } from "next/server"
import type { z } from "zod"

export const POST = async (request: Request) => {
	const badContentLengthResponse = await contentLength(request)
	if (badContentLengthResponse) return badContentLengthResponse

	const formPasteResult = parseZodFormDataSchema<z.infer<typeof BackendSchema>>(BackendSchema, await request.formData())
	if (formPasteResult.isErr()) return new NextResponse(formPasteResult.error, { status: 400 })

	const { ivClient, contentBlob, oneTime, expiresAfter, contentType, syntax } = formPasteResult.value

	const pasteContent = await contentBlob.text()

	const pasteSyntax = await getPasteSyntax({
		encrypted: ivClient !== undefined,
		syntax: syntax,
		contentType: contentType,
		content: pasteContent
	})

	return insertPaste({
		content: Buffer.from(pasteContent),
		syntax: pasteSyntax,
		ivClientBase64: ivClient,
		oneTime: oneTime,
		expiresAt: getExpiresAt(expiresAfter).toISOString(),
		link: contentType === "link"
	})
		.andThen((insertedPaste) =>
			parseZodSchema(SavePasteResponseSchema, {
				id: insertedPaste.id,
				url: buildPasteUrl({ id: insertedPaste.id }),
				syntax: pasteSyntax
			})
		)
		.match(
			(saveResponse) => NextResponse.json(saveResponse),
			(e) => new NextResponse(e, { status: 500 })
		)
}
