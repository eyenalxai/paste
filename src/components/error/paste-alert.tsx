import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import { CircleAlertIcon } from "lucide-react"

type PasteAlertProps = {
	title: string
	description: string
	variant: "destructive" | "warning"
}

const pasteAlertVariants = cva("", {
	variants: {
		variant: {
			destructive: cn(
				"bg-red-200",
				"dark:bg-red-900",
				"border-red-500",
				"dark:border-red-500",
				"text-red-900",
				"dark:text-red-200",
				"[&>svg]:stroke-red-900",
				"dark:[&>svg]:stroke-red-200"
			),
			warning: cn(
				"bg-yellow-200",
				"dark:bg-yellow-900",
				"border-yellow-500",
				"dark:border-yellow-500",
				"text-yellow-900",
				"dark:text-yellow-200",
				"[&>svg]:stroke-yellow-900",
				"dark:[&>svg]:stroke-yellow-200"
			)
		}
	}
})

export const PasteAlert = ({ title, description, variant }: PasteAlertProps) => {
	return (
		<Alert className={cn(pasteAlertVariants({ variant }))}>
			<CircleAlertIcon className="size-4" />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{description}</AlertDescription>
		</Alert>
	)
}
