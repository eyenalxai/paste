"use client"

import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/error-message"
import { cn } from "@/lib/utils"
import { Copy } from "lucide-react"
import { toast } from "sonner"

type CopyContentButtonProps = {
	loading?: boolean
	content?: string
}

export const CopyContentButton = ({ loading, content }: CopyContentButtonProps) => (
	<Button
		disabled={loading || !content}
		onClick={() =>
			content &&
			navigator.clipboard
				.writeText(content)
				.then(() => toast.info("Copied to clipboard"))
				.catch((error) => toast.error(getErrorMessage(error, "Failed to copy to clipboard")))
		}
		className={cn("w-fit")}
	>
		<div className={cn("flex", "flex-row", "gap-x-2", "items-center")}>
			<Copy />
			<div className={cn("font-semibold")}>Copy</div>
		</div>
	</Button>
)
