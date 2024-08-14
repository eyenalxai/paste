import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		MAX_PAYLOAD_SIZE: z.number().int().positive(),
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
		NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION: z
			.string()
			.optional()
			.refine((value) => value === undefined || value.toLowerCase() === "true" || value.toLowerCase() === "false", {
				message: "NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION must be 'true' or 'false' if set."
			})
			.transform((value) => value && value.toLowerCase() === "true")
	},
	runtimeEnv: {
		MAX_PAYLOAD_SIZE: 1024 * 1024 * 20, // Total: 20MB
		DATABASE_URL: process.env.DATABASE_URL,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
		NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION: process.env.NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION
	},
	skipValidation: process.env.BUILD_TIME === "TRUE"
})
