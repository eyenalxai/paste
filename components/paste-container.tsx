import { CopyContentButton } from "@/components/copy-content-button"
import { DangerousMarkdownDisplay, MarkdownDisplay } from "@/components/markdown"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { ReactNode } from "react"
import type { VFile } from "vfile"

type PasteContainerProps = {
	loading?: boolean
	content?: string
	id?: string
	keyBase64?: string
	noWrap?: boolean
	children?: ReactNode
	markdown?: VFile
}

export const PasteContainer = ({
	loading,
	content,
	id,
	keyBase64,
	noWrap,
	children,
	markdown
}: PasteContainerProps) => (
	<div className={cn("flex", "flex-col", "gap-4")}>
		<div className={cn("flex", "flex-row", "flex-wrap", "gap-4", "justify-start", "items-center")}>
			<CopyContentButton loading={loading} content={content} />
			<Button variant={"outline"} asChild>
				<Link href={"/"}>New paste</Link>
			</Button>
			{id && keyBase64 && (
				<Button variant={"outline"} asChild>
					<a target="_blank" rel="noopener noreferrer" href={`/${id}/raw/?key=${keyBase64}`}>
						Raw
					</a>
				</Button>
			)}
		</div>
		{!loading && (
			<div className={cn(["border", "p-4"], "rounded", "font-mono", !noWrap && "whitespace-pre-wrap", "text-sm")}>
				{children && <MarkdownDisplay>{children}</MarkdownDisplay>}
				{markdown && <DangerousMarkdownDisplay markdown={markdown} />}
			</div>
		)}
	</div>
)
