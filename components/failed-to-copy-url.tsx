import { Keyboard } from "@/components/keyboard"
import { getKeyboardShortcut } from "@/lib/keyboard-shorcut"
import { cn } from "@/lib/utils"
import { CircleAlert } from "lucide-react"
import { useEffect, useRef } from "react"

type FailedToCopyUrlProps = {
	url: string
}

export const FailedToCopyUrl = ({ url }: FailedToCopyUrlProps) => {
	const textRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (textRef.current) {
			textRef.current.select()
		}
	}, [])

	return (
		<div className={cn("flex", "flex-row", "items-start", "justify-between", "gap-4")}>
			<CircleAlert className={cn("size-4", "start-0")} />
			<div className={cn("flex")}>
				<div className={cn("flex", "flex-col", "gap-2")}>
					<div className={cn("font-semibold")}>Failed to copy the URL</div>
					<div className={cn("flex", "flex-row", "gap-2")}>
						<div>Press</div>
						<Keyboard text={getKeyboardShortcut("copy")} />
						<div>to copy the URL manually</div>
					</div>
					<textarea
						ref={textRef}
						value={url}
						readOnly
						style={{ position: "absolute", left: "-10000px", top: "-10000px" }}
					/>
				</div>
			</div>
		</div>
	)
}
