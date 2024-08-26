export const userAgent = () => {
	if (typeof window !== "undefined") {
		return navigator.userAgent
	}

	const { headers } = require("next/headers")
	const headersList = headers()
	return headersList.get("user-agent")
}
