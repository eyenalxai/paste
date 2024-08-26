import { getErrorMessage } from "@/lib/error-message"
import { type Result, err, ok } from "neverthrow"
import { ZodError, type ZodSchema, type z } from "zod"
import { formData } from "zod-form-data"

export const parseZodSchema = <T>(schema: ZodSchema<T>, data: unknown): Result<T, string> => {
	try {
		return ok(schema.parse(data))
	} catch (error) {
		if (error instanceof ZodError) {
			return err(error.errors.map((e) => e.message).join(", "))
		}
		return err(getErrorMessage(error, "An unexpected error during schema validation occurred"))
	}
}

export const parseZodFormDataSchema = <T>(schema: z.ZodTypeAny, data: FormData): Result<T, string> => {
	try {
		const formSchema = formData(schema)
		const formDataObject = formSchema.parse(data)
		return ok(formDataObject)
	} catch (error) {
		if (error instanceof ZodError) {
			return err(error.errors.map((e) => e.message).join(", "))
		}
		return err(getErrorMessage(error, "An unexpected error during form schema validation occurred"))
	}
}
