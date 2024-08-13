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
	uuid?: string
	noWrap?: boolean
} & (
	| {
			children: ReactNode
	  }
	| {
			markdown: VFile
	  }
)

export const PasteContainer = ({ loading, content, uuid, noWrap, ...props }: PasteContainerProps) => (
	<div className={cn("flex", "flex-col", "gap-4")}>
		<div className={cn("flex", "flex-row", "flex-wrap", "gap-4", "justify-start", "items-center")}>
			<CopyContentButton loading={loading} content={content} />
			<Button variant={"outline"} asChild>
				<Link href={"/"}>New paste</Link>
			</Button>
			{uuid && (
				<Button variant={"outline"} asChild>
					<Link href={`/${uuid}/raw`}>Raw</Link>
				</Button>
			)}
		</div>
		<div
			className={cn(!loading && ["border", "p-4"], "rounded", "font-mono", !noWrap && "whitespace-pre-wrap", "text-sm")}
		>
			{"children" in props ? (
				<MarkdownDisplay>{props.children}</MarkdownDisplay>
			) : (
				<DangerousMarkdownDisplay markdown={props.markdown} />
			)}
		</div>
	</div>
)
