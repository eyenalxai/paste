import { Result } from "neverthrow"

export const createFile = Result.fromThrowable(
	(content: string, name: string) => new File([content], name, { type: "text/plain" }),
	(e) => (e instanceof Error && e.message !== "" ? e.message : "Failed to create file")
)
