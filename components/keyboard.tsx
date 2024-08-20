import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Command } from "lucide-react"
import { isMacOs } from "react-device-detect"

type KeyboardProps = {
	text: string
}

export const Keyboard = ({ text }: KeyboardProps) => {
	return (
		<Badge
			className={cn("select-none", "pointer-events-none", "rounded", "text-sm", "text-muted-foreground", "bg-muted")}
		>
			{isMacOs && <Command className={cn("size-3.5")} />}
			{text}
		</Badge>
	)
}
