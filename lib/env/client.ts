"use client"

class ClientEnv {
	// biome-ignore lint/style/noNonNullAssertion: constructor throws if not set
	frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL!

	constructor() {
		if (!this.frontendUrl) throw new Error("NEXT_PUBLIC_FRONTEND_URL not set")
	}
}

export const clientEnv = new ClientEnv()
