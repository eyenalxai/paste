import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Command } from "lucide-react"

type KeyboardProps = {
	text: string
	isMacOS?: boolean
}

export const Keyboard = ({ text, isMacOS }: KeyboardProps) => {
	return (
		<Badge className={cn("select-none", "rounded", "text-sm")}>
			{isMacOS && <Command className={cn("size-3.5")} />}
			{text}
		</Badge>
	)
}
