import { z } from "zod"

export const ExpiresAfter = z.enum(["1-hour", "1-day", "1-week", "1-month"])

export const PasteFormSchema = z.object({
	content: z.string().min(2, {
		message: "Paste must be at least 2 characters long"
	}),
	encrypted: z.boolean(),
	oneTime: z.boolean(),
	expiresAfter: ExpiresAfter
})
