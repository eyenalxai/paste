type PreviewImageContainerProps = {
	title: string
	text: string
}

export const PreviewImageContainer = ({ title, text }: PreviewImageContainerProps) => {
	const processedText = text.replace(/\t/g, "  ")

	return (
		<div
			style={{
				fontSize: "2rem",
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
				{processedText.length > 800 ? `${processedText.slice(0, 800)}...` : processedText}
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
}
