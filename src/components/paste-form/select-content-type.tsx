import { FormControl, FormField, FormItem } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { env } from "@/lib/env.mjs"
import { cn } from "@/lib/utils"
import { type FrontendSchema, selectContentTypeOptions } from "@/lib/zod/form/frontend"
import { useFormContext } from "react-hook-form"
import type { z } from "zod"

type SelectContentTypeProps = {
	encrypted: boolean
}

export const SelectContentType = ({ encrypted }: SelectContentTypeProps) => {
	const methods = useFormContext<z.infer<typeof FrontendSchema>>()

	return (
		<FormField
			control={methods.control}
			name="contentType"
			render={({ field }) => (
				<FormItem>
					<div className={cn("flex", "flex-row", "gap-x-2")}>
						<div className={cn("flex", "justify-center", "items-center", "text-center", "whitespace-nowrap")}>
							Content type
						</div>
						<Select onValueChange={field.onChange} value={field.value}>
							<FormControl>
								<SelectTrigger className={cn("w-32")}>
									<SelectValue>
										{selectContentTypeOptions[field.value as keyof typeof selectContentTypeOptions]}
									</SelectValue>
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{Object.entries(selectContentTypeOptions).map(([key, value]) => {
									if (key === "auto" && !env.NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION) return

									if (encrypted && key === "auto") return null
									return (
										<SelectItem key={key} value={key}>
											{value}
										</SelectItem>
									)
								})}
							</SelectContent>
						</Select>
					</div>
				</FormItem>
			)}
		/>
	)
}
