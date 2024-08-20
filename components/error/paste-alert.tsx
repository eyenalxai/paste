import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { CircleAlertIcon } from "lucide-react"

type PasteAlertProps = {
	title: string
	description: string
	variant: "destructive" | "warning"
}

export const PasteAlert = ({ title, description, variant }: PasteAlertProps) => {
	const colors = {
		destructive: {
			bg: ["bg-red-200", "dark:bg-red-900"],
			border: ["border-red-500", "dark:border-red-500"],
			stroke: ["stroke-red-900", "dark:stroke-red-200"],
			text: ["text-red-900", "dark:text-red-200"]
		},
		warning: {
			bg: ["bg-yellow-200", "dark:bg-yellow-900"],
			border: ["border-yellow-500", "dark:border-yellow-500"],
			stroke: ["stroke-yellow-900", "dark:stroke-yellow-200"],
			text: ["text-yellow-900", "dark:text-yellow-200"]
		}
	} as const

	return (
		<Alert variant="destructive" className={cn(colors[variant].bg, colors[variant].border)}>
			<CircleAlertIcon className={cn("size-4", colors[variant].stroke)} />
			<AlertTitle className={cn(colors[variant].text)}>{title}</AlertTitle>
			<AlertDescription className={cn(colors[variant].text)}>{description}</AlertDescription>
		</Alert>
	)
}
