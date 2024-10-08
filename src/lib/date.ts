import { exhaustiveCheck } from "@/lib/utils"
import type { ExpiresAfter } from "@/lib/zod/form/common"
import type { z } from "zod"

export const getExpiresAt = (expiresAfter: z.infer<typeof ExpiresAfter>) => {
	switch (expiresAfter) {
		case "5-minutes":
			return new Date(Date.now() + 1000 * 60 * 5)
		case "30-minutes":
			return new Date(Date.now() + 1000 * 60 * 30)
		case "1-hour":
			return new Date(Date.now() + 1000 * 60 * 60)
		case "6-hours":
			return new Date(Date.now() + 1000 * 60 * 60 * 6)
		case "1-day":
			return new Date(Date.now() + 1000 * 60 * 60 * 24)
		case "1-week":
			return new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
		case "1-month":
			return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
		default:
			return exhaustiveCheck(expiresAfter)
	}
}
