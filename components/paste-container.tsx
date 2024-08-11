import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export const PasteContainer = ({ children }: { children: ReactNode }) => (
	<div className={cn("border", "p-4", "rounded", "font-mono", "whitespace-pre-wrap", "text-sm")}>{children}</div>
)
