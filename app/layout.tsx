import "./globals.css"
import "./code-style.css"
import { Providers } from "@/components/providers"
import { clientEnv } from "@/lib/env/client"
import { fontMono, fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"

const TITLE = "Paste"
const DESCRIPTION = "Share text"

export const metadata: Metadata = {
	metadataBase: new URL(clientEnv.frontendUrl),
	title: TITLE,
	description: DESCRIPTION,
	openGraph: {
		title: TITLE,
		description: DESCRIPTION,
		type: "website",
		url: new URL(clientEnv.frontendUrl)
	}
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "0 0% 100%" },
		{ media: "(prefers-color-scheme: dark)", color: "222.2 84% 4.9%" }
	]
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn("font-sans", "antialiased", fontSans.variable, fontMono.variable)}>
				<Providers attribute="class" defaultTheme="system" enableSystem>
					<main className={cn("container", "mx-auto", "p-4")}>{children}</main>
				</Providers>
			</body>
		</html>
	)
}
