"use client"

import { Button } from "@/components/ui/button"
import { useNotAtTop } from "@/lib/hooks/not-at-top"
import { cn } from "@/lib/utils"
import { ArrowUp } from "lucide-react"

export const ScrollAnchor = () => {
	const notAtTop = useNotAtTop()

	return (
		<Button
			onClick={() =>
				notAtTop
					? window.scrollTo({
							top: 0,
							behavior: "smooth"
						})
					: null
			}
			className={cn(
				"fixed",
				"bottom-6",
				"right-6",
				["transition", "duration-300", "ease-in-out"],
				notAtTop ? "opacity-100" : "opacity-0"
			)}
			variant={"outline"}
			size={"icon"}
		>
			<ArrowUp />
		</Button>
	)
}
