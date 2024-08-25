import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

const StringBoolean = z
	.string()
	.optional()
	.transform((value) => (value === "" ? undefined : value))
	.transform((value) => value && value.toLowerCase() === "true")
	.pipe(z.boolean().default(false))

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url()
	},
	client: {
		NEXT_PUBLIC_FRONTEND_URL: z
			.string()
			.url()
			.refine((url) => new URL(url).protocol === "https:", {
				message: "HTTPS is required"
			}),
		NEXT_PUBLIC_MAX_PAYLOAD_SIZE: z
			.string()
			.optional()
			.transform((value) => (value === "" || value === undefined ? 2 : Number.parseFloat(value)))
			.refine((value) => value > 0, {
				message: "MAX_PAYLOAD_SIZE must be greater than 0"
			})
			.transform((value) => value * 1024 * 1024), // In MiB
		NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION: StringBoolean,
		NEXT_PUBLIC_CLIENT_SIDE_ENCRYPTION_ONLY: StringBoolean
	},
	runtimeEnv: {
		NEXT_PUBLIC_MAX_PAYLOAD_SIZE: process.env.NEXT_PUBLIC_MAX_PAYLOAD_SIZE,
		DATABASE_URL: process.env.DATABASE_URL,
		NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
		NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION: process.env.NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION,
		NEXT_PUBLIC_CLIENT_SIDE_ENCRYPTION_ONLY: process.env.NEXT_PUBLIC_CLIENT_SIDE_ENCRYPTION_ONLY
	},
	skipValidation: process.env.BUILD_TIME?.toLowerCase() === "true"
})
