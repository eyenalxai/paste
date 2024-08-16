import { pasteIdExists } from "@/lib/select"

const generateRandomId = () => {
	const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	return Array.from({ length: 5 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join("")
}
const checkId = async (id: string): Promise<string> => {
	return (await pasteIdExists(id)) ? checkId(generateRandomId()) : id
}

export const generateRandomUniqueId = async () => {
	return await checkId(generateRandomId())
}
