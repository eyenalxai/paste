import { env } from "@/lib/env"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
	dialect: "postgresql",
	schema: "./lib/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		url: env.DATABASE_URL
	}
})
