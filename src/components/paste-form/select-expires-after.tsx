import { FormControl, FormField, FormItem } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { type FrontendSchema, selectExpiresAfterOptions } from "@/lib/zod/form/frontend"
import { useFormContext } from "react-hook-form"
import type { z } from "zod"

export const SelectExpiresAfter = () => {
	const methods = useFormContext<z.infer<typeof FrontendSchema>>()

	return (
		<FormField
			control={methods.control}
			name="expiresAfter"
			render={({ field }) => (
				<FormItem>
					<div className={cn("flex", "flex-row", "gap-x-2")}>
						<div className={cn("flex", "justify-center", "items-center", "text-center", "whitespace-nowrap")}>
							Expires after
						</div>
						<Select onValueChange={field.onChange} value={field.value}>
							<FormControl>
								<SelectTrigger className={cn("w-32")}>
									<SelectValue>
										{selectExpiresAfterOptions[field.value as keyof typeof selectExpiresAfterOptions]}
									</SelectValue>
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{Object.entries(selectExpiresAfterOptions).map(([key, value]) => (
									<SelectItem key={key} value={key}>
										{value}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</FormItem>
			)}
		/>
	)
}
