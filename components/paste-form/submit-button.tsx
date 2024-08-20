import { Keyboard } from "@/components/keyboard"
import { Button } from "@/components/ui/button"
import { getSaveShortcut } from "@/lib/keyboard-shorcut"
import { cn } from "@/lib/utils"
import { Copy, Loader } from "lucide-react"
import { isDesktop, isMacOs } from "react-device-detect"

type SubmitButtonProps = {
	isSubmitting: boolean
}

export const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
	return (
		<div className={cn("flex", "flex-row", "items-center", "justify-start", "gap-2")}>
			<Button disabled={isSubmitting} type="submit" className={cn("w-24")}>
				<div className={cn("flex", "flex-row", "gap-x-2", "items-center")}>
					{isSubmitting ? (
						<Loader className={cn("animate-spin")} />
					) : (
						<>
							<Copy />
							<div className={cn("font-semibold")}>Save</div>
						</>
					)}
				</div>
			</Button>
			{isDesktop && (
				<div className={cn(isSubmitting ? "opacity-50" : "opacity-100")}>
					<Keyboard text={getSaveShortcut()} isMacOS={isMacOs} />
				</div>
			)}
		</div>
	)
}
