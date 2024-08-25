import { clsx } from "clsx"

export function cn(...inputs: string[]) {
	return clsx(inputs)
}

export const exhaustiveCheck = (_: never): never => {
	throw new Error("Exhaustive check failed")
}
