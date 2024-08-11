import { z } from "zod"

export const ExpiresAfter = z.enum(["5-minutes", "30-minutes", "1-hour", "6-hours", "1-day", "1-week", "1-month"])

export const InitializationVectorSchema = z.object({
	iv: z.string().optional()
})

export const EncryptedDataSchema = z.object({
	encrypted: z.boolean()
})

export const SharedFormFields = z.object({
	content: z.string().min(2, {
		message: "Paste must be at least 2 characters long"
	}),
	oneTime: z.boolean(),
	expiresAfter: ExpiresAfter
})

export const PasteFormSchema = SharedFormFields.merge(EncryptedDataSchema)

export const SecurePasteFormSchema = SharedFormFields.merge(InitializationVectorSchema)

export const selectExpiresAfterOptions: Record<z.infer<typeof ExpiresAfter>, string> = {
	"5-minutes": "5 minutes",
	"30-minutes": "30 minutes",
	"1-hour": "1 hour",
	"6-hours": "6 hours",
	"1-day": "1 day",
	"1-week": "1 week",
	"1-month": "1 month"
}
