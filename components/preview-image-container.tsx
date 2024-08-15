import type { ReactNode } from "react"

type PreviewImageContainerProps = {
	children: ReactNode
	title: string
}

export const PreviewImageContainer = ({ children, title }: PreviewImageContainerProps) => (
	<div
		style={{
			fontSize: "1.5rem",
			fontFamily: "monospace",
			backgroundColor: "#020817",
			color: "#f8fafc",
			width: "100%",
			height: "100%",
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start",
			justifyContent: "space-between",
			padding: "1rem",
			whiteSpace: "pre-wrap"
		}}
	>
		<div
			style={{
				backgroundImage: "linear-gradient(0deg, #020817 0%, #fff 100%)",
				backgroundClip: "text",
				color: "transparent",
				display: "block",
				height: "100%"
			}}
		>
			{children}
		</div>
		<div
			style={{
				fontSize: "5rem",
				color: "white"
			}}
		>
			{title}
		</div>
	</div>
)
