import { type Result, err, ok } from "neverthrow"
import { ZodError, type ZodSchema } from "zod"

export const parseZodSchema = <T>(schema: ZodSchema<T>, data: unknown): Result<T, string> => {
	try {
		return ok(schema.parse(data))
	} catch (error) {
		if (error instanceof ZodError) {
			return err(error.errors.map((e) => e.message).join(", "))
		}
		return err("An unexpected error during schema validation occurred")
	}
}
