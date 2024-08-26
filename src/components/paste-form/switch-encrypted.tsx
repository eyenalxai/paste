import { FormControl, FormField } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { env } from "@/lib/env.mjs"
import { cn } from "@/lib/utils"
import type { FrontendSchema } from "@/lib/zod/form/frontend"
import { useFormContext } from "react-hook-form"
import type { z } from "zod"

export const SwitchEncrypted = () => {
	const methods = useFormContext<z.infer<typeof FrontendSchema>>()

	if (env.NEXT_PUBLIC_CLIENT_SIDE_ENCRYPTION_ONLY) return null

	return (
		<FormField
			control={methods.control}
			name="encrypted"
			render={({ field }) => (
				<div className={cn("flex", "flex-row", "gap-x-2")}>
					<div className={cn("flex", "justify-center", "items-center", "text-center")}>Encrypt</div>
					<FormControl>
						<Switch checked={field.value} onCheckedChange={field.onChange} />
					</FormControl>
				</div>
			)}
		/>
	)
}
