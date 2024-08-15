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
		DATABASE_URL: z.string().url(),
		OPENAI_API_KEY: z
			.string()
			.optional()
			.transform((value) => (value === "" ? undefined : value))
			.refine(
				(value) => value !== undefined || process.env.NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION?.toLowerCase() !== "true",
				{
					message: "OPENAI_API_KEY must be set if NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION is true."
				}
			)
			.refine((value) => value === undefined || (value.startsWith("sk-") && value.length >= 16), {
				message: "OPENAI_API_KEY must start with 'sk-' and be at least 16 characters long if set."
			})
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
			.transform((value) => value * 1024 * 1024),
		NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION: StringBoolean,
		NEXT_PUBLIC_CLIENT_SIDE_ENCRYPTION_ONLY: StringBoolean
	},
	runtimeEnv: {
		NEXT_PUBLIC_MAX_PAYLOAD_SIZE: process.env.NEXT_PUBLIC_MAX_PAYLOAD_SIZE,
		DATABASE_URL: process.env.DATABASE_URL,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
		NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION: process.env.NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION,
		NEXT_PUBLIC_CLIENT_SIDE_ENCRYPTION_ONLY: process.env.NEXT_PUBLIC_CLIENT_SIDE_ENCRYPTION_ONLY
	},
	skipValidation: process.env.BUILD_TIME === "TRUE"
})
