import { CopyContentButton } from "@/components/copy-content-button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type PasteContainerProps = {
	loading?: boolean
	content?: string
	children: ReactNode
}

export const PasteContainer = ({ loading, content, children }: PasteContainerProps) => (
	<div className={cn("flex", "flex-col", "gap-4")}>
		<CopyContentButton loading={loading} content={content} />
		<div className={cn(!loading && "border", "p-4", "rounded", "font-mono", "whitespace-pre-wrap", "text-sm")}>
			{children}
		</div>
	</div>
)
