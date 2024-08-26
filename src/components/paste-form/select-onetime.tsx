import { FormControl, FormField } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { FrontendSchema } from "@/lib/zod/form/frontend"
import { useFormContext } from "react-hook-form"
import type { z } from "zod"

export const SelectOnetime = () => {
	const methods = useFormContext<z.infer<typeof FrontendSchema>>()

	return (
		<FormField
			control={methods.control}
			name="oneTime"
			render={({ field }) => (
				<div className={cn("flex", "flex-row", "gap-x-2")}>
					<div className={cn("flex", "justify-center", "items-center", "text-center")}>Burn after reading</div>
					<FormControl>
						<Switch checked={field.value} onCheckedChange={field.onChange} />
					</FormControl>
				</div>
			)}
		/>
	)
}
