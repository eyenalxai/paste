import type { ReactNode } from "react"

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<main>{children}</main>
			</body>
		</html>
	)
}
