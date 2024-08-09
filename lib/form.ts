import { z } from "zod"

export const PasteFormSchema = z.object({
	content: z.string().min(2, {
		message: "Paste must be at least 2 characters long"
	}),
	encrypted: z.boolean().default(true)
})
