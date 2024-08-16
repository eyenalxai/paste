import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { CircleAlertIcon } from "lucide-react"

type PasteAlertProps = {
	title: string
	description: string
}

export const PasteAlert = ({ title, description }: PasteAlertProps) => (
	<Alert variant="destructive" className={cn("bg-red-200", "dark:bg-red-900", "border-red-500", "dark:border-red-500")}>
		<CircleAlertIcon className={cn("size-4", "stroke-red-900", "dark:stroke-red-200")} />
		<AlertTitle className={cn("text-red-900", "dark:text-red-200")}>{title}</AlertTitle>
		<AlertDescription className={cn("text-red-900", "dark:text-red-200")}>{description}</AlertDescription>
	</Alert>
)
