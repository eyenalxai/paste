import { CopyContentButton } from "@/components/copy-content-button"
import { PasteAlert } from "@/components/error/paste-alert"
import { DangerousMarkdownDisplay } from "@/components/markdown"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { ReactNode } from "react"
import type { VFile } from "vfile"

type PasteContainerProps = {
	loading?: boolean
	error?: {
		title: string
		description: string
	}
	oneTime?: boolean
	preview?: boolean
	content?: string
	id?: string
	noWrap?: boolean
	resetFn?: () => void
	children?: ReactNode
	markdown?: VFile
}

export const PasteContainer = ({
	loading,
	error,
	oneTime,
	preview,
	content,
	id,
	noWrap,
	resetFn,
	markdown
}: PasteContainerProps) => (
	<div className={cn("flex", "flex-col", "gap-4")}>
		<div className={cn("flex", "flex-row", "flex-wrap", "gap-4", "justify-start", "items-center")}>
			{!error && <CopyContentButton loading={loading} content={content} />}
			<Button className={cn("select-none")} onClick={resetFn} variant={"outline"} asChild>
				<Link href={"/"}>New paste</Link>
			</Button>
			{id && !oneTime && (
				<Button className={cn("select-none")} variant={"outline"} asChild>
					<a target="_blank" rel="noopener noreferrer" href={`/${id}/raw`}>
						Raw
					</a>
				</Button>
			)}
		</div>
		{oneTime && !preview && (
			<PasteAlert variant={"warning"} title={"One-time paste"} description={"This paste can only be viewed once"} />
		)}
		{error && <PasteAlert variant={"destructive"} title={error.title} description={error.description} />}
		{!loading && !error && (
			<div className={cn(["border", "p-4"], "rounded", "font-mono", !noWrap && "whitespace-pre-wrap", "text-sm")}>
				{markdown && <DangerousMarkdownDisplay markdown={markdown} />}
			</div>
		)}
	</div>
)
