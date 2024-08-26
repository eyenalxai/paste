export const getErrorMessage = (error: unknown, override: string) =>
	error instanceof Error && error.message !== "" ? error.message : override
