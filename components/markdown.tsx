import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import type { VFile } from "vfile"

type DangerousMarkdownDisplayProps = {
	markdown: VFile
}

export const DangerousMarkdownDisplay = ({ markdown }: DangerousMarkdownDisplayProps) => (
	<article
		className={cn("prose", "prose-slate", "dark:prose-invert", "max-w-max")}
		// biome-ignore lint/security/noDangerouslySetInnerHtml: I was told it was sanitized
		dangerouslySetInnerHTML={{ __html: String(markdown) }}
	/>
)
