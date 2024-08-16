export const generateRandomId = () => {
	const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	return Array.from({ length: 5 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join("")
}
