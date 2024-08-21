import { cn } from "@/lib/utils"

type PreviewImageContainerProps = {
	title: string
	text: string
}

export const PreviewImageContainer = ({ title, text }: PreviewImageContainerProps) => {
	const processedText = text.replace(/\t/g, "  ")

	return (
		<div
			style={{
				whiteSpace: "pre-wrap"
			}}
			tw={cn(
				"text-lg",
				"font-mono",
				"bg-[#020817]",
				"text-[#f8fafc]",
				"w-full",
				"h-full",
				"flex",
				"flex-col",
				"items-start",
				"justify-between",
				"p-4"
			)}
		>
			<div
				style={{
					backgroundImage: "linear-gradient(0deg, #020817 0%, #fff 100%)",
					backgroundClip: "text",
					color: "transparent"
				}}
				tw={cn("block", "h-full")}
			>
				{processedText.length > 800 ? `${processedText.slice(0, 800)}...` : processedText}
			</div>
			<div tw={cn("text-[5rem]", "text-white")}>{title}</div>
		</div>
	)
}
