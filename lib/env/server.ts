import "server-only"

class ServerEnv {
	// biome-ignore lint/style/noNonNullAssertion: constructor throws if not set
	databaseUrl = process.env.DATABASE_URL!

	constructor() {
		if (!this.databaseUrl) throw new Error("NEXT_PUBLIC_FRONTEND_URL not set")
	}
}

export const serverEnv = new ServerEnv()
