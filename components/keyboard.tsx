import { cn } from "@/lib/utils"

type KeyboardProps = {
	text: string
}

export const Keyboard = ({ text }: KeyboardProps) => {
	return (
		<kbd
			className={cn(
				"pointer-events-none",
				"inline-flex",
				"h-5",
				"select-none",
				"items-center",
				"gap-1",
				"rounded",
				"border",
				"bg-muted",
				"px-1.5",
				"font-mono",
				"text-[10px]",
				"font-medium",
				"text-muted-foreground",
				"opacity-100"
			)}
		>
			{text}
		</kbd>
	)
}
