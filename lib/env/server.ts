import "server-only"

class ServerEnv {
	// biome-ignore lint/style/noNonNullAssertion: constructor throws if not set
	maxPayloadSize = 1024 * 1024

	private _databaseUrl: string | undefined

	get databaseUrl() {
		if (!this._databaseUrl) {
			this._databaseUrl = process.env.DATABASE_URL
			if (!this._databaseUrl) {
				throw new Error("DATABASE_URL not set")
			}
		}
		return this._databaseUrl
	}
}

export const serverEnv = new ServerEnv()
