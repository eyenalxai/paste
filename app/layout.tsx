import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn("font-sans", "antialiased")}>
				<main className={cn("container", "mx-auto", "p-4")}>{children}</main>
			</body>
		</html>
	)
}
