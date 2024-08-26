import { Keyboard } from "@/components/keyboard"
import { getKeyboardShortcut } from "@/lib/keyboard-shorcut"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

type FailedToCopyUrlProps = {
	error: string
	content: string
}

export const FailedToCopyUrl = ({ error, content }: FailedToCopyUrlProps) => {
	const textRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (textRef.current) {
			textRef.current.select()
		}
	}, [])

	return (
		<div className={cn("flex", "flex-col", "gap-y-1")}>
			<div className={cn("font-semibold")}>{error}</div>
			<div className={cn("flex", "flex-row", "justify-center", "items-center", "gap-x-2")}>
				<div>Press</div>
				<Keyboard text={getKeyboardShortcut("copy")} />
				<div>to copy the manually</div>
			</div>
			<textarea
				ref={textRef}
				value={content}
				readOnly
				style={{ position: "absolute", left: "-10000px", top: "-10000px" }}
			/>
		</div>
	)
}
