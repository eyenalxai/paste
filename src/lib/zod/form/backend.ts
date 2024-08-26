import { env } from "@/lib/env.mjs"
import { ContentType, ExpiresAfter, StringBoolean, SyntaxOptional } from "@/lib/zod/form/common"
import { z } from "zod"
import { zfd } from "zod-form-data"

export const BackendSchema = zfd
	.formData({
		ivClient: z
			.string()
			.optional()
			.transform((value) => (value === "" || value === "undefined" ? undefined : value)),
		contentBlob: zfd.file().refine((value) => value.size <= env.NEXT_PUBLIC_MAX_PAYLOAD_SIZE, {
			message: `Paste size exceeds ${env.NEXT_PUBLIC_MAX_PAYLOAD_SIZE / 1024 / 1024} MiB`
		}),
		oneTime: StringBoolean,
		expiresAfter: ExpiresAfter,
		contentType: ContentType,
		syntax: SyntaxOptional
	})
	.refine(({ contentType }) => contentType !== "auto" || env.NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION, {
		message: "Automatic content type detection is not available"
	})
	.refine(({ ivClient }) => ivClient !== undefined || !env.NEXT_PUBLIC_CLIENT_SIDE_ENCRYPTION_ONLY, {
		message: "Server-side encryption is disabled"
	})
	.refine(({ contentType, syntax }) => !(contentType !== "source" && syntax !== undefined), {
		message: "Syntax selection is only allowed for source content type"
	})
