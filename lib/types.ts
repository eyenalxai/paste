import type { Syntax } from "@/lib/form"
import type { z } from "zod"

export type AllSyntax = z.infer<typeof Syntax> | "markdown"
