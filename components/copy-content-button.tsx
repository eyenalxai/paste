"use client"

import { Button } from "@/components/ui/button"
import { copyToClipboard } from "@/lib/clipboard"
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
			copyToClipboard(content).match(
				() => toast.info("Copied to clipboard"),
				(error) => toast.error(error)
			)
		}
		className={cn("w-fit", "select-none")}
	>
		<div className={cn("flex", "flex-row", "gap-x-2", "items-center")}>
			<Copy />
			<div className={cn("font-semibold")}>Copy</div>
		</div>
	</Button>
)
