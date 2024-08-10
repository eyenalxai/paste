import { Roboto_Mono as FontMono, Inter as FontSans } from "next/font/google"

export const fontSans = FontSans({
	variable: "--font-sans",
	subsets: ["latin", "cyrillic"]
})

export const fontMono = FontMono({
	variable: "--font-mono",
	subsets: ["latin", "cyrillic"]
})
