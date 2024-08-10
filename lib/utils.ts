import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const exhaustiveCheck = (_: never): never => {
	throw new Error("Exhaustive check failed")
}
