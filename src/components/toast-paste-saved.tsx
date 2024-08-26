import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ToastPasteSavedProps = {
	url: string
	encrypted: boolean
	oneTime: boolean
}

export const ToastPasteSaved = ({ url, encrypted, oneTime }: ToastPasteSavedProps) => {
	return (
		<div className={cn("flex", "flex-row", "gap-4", "justify-between", "items-center", "w-full")}>
			<div>URL copied to clipboard</div>
			{!encrypted && !oneTime && (
				<Button asChild variant={"outline"} className={cn("h-8")}>
					<a target={"_blank"} rel="noopener noreferrer" href={url}>
						Open
					</a>
				</Button>
			)}
		</div>
	)
}
