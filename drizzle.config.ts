import { defineConfig } from "drizzle-kit"

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/lib/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: This will be only run locally
		url: process.env.DATABASE_URL!
	}
})
