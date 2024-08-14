import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		MAX_PAYLOAD_SIZE: z.number().int().positive()
	},
	client: {
		NEXT_PUBLIC_FRONTEND_URL: z
			.string()
			.url()
			.refine((url) => new URL(url).protocol === "https:", {
				message: "HTTPS is required"
			})
	},
	runtimeEnv: {
		MAX_PAYLOAD_SIZE: 1024 * 1024,
		DATABASE_URL: process.env.DATABASE_URL,
		NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL
	},
	skipValidation: process.env.BUILD_TIME === "TRUE"
})
