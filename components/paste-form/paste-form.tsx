import { SelectContentType } from "@/components/paste-form/select-content-type"
import { SelectExpiresAfter } from "@/components/paste-form/select-expires-after"
import { SelectOnetime } from "@/components/paste-form/select-onetime"
import { SelectSyntax } from "@/components/paste-form/select-syntax"
import { SwitchEncrypted } from "@/components/paste-form/switch-encrypted"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { ContentType } from "@/lib/zod/form/common"
import type { FrontendSchema } from "@/lib/zod/form/frontend"
import { Copy, Loader } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type { z } from "zod"

type PasteFormProps = {
	onSubmit: (formData: z.infer<typeof FrontendSchema>) => Promise<void>
	isSubmitting: boolean
	encrypted: boolean
	contentType: z.infer<typeof ContentType>
}

export const PasteForm = ({ onSubmit, isSubmitting, encrypted, contentType }: PasteFormProps) => {
	const methods = useFormContext<z.infer<typeof FrontendSchema>>()

	return (
		<Form {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)} className={cn("space-y-4")}>
				<div className={cn("flex", "flex-row", "flex-wrap", "gap-4", "justify-start", "items-center")}>
					<SwitchEncrypted />
					<SelectOnetime />
					<SelectExpiresAfter />
					<SelectContentType encrypted={encrypted} />
					<SelectSyntax contentType={contentType} />
				</div>
				<FormField
					control={methods.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea className={cn("h-[80vh]", "font-mono")} {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<Button disabled={isSubmitting} type="submit" className={cn("w-32")}>
					<div className={cn("flex", "flex-row", "gap-x-2", "items-center")}>
						{isSubmitting ? (
							<Loader className={cn("animate-spin")} />
						) : (
							<>
								<Copy />
								<div className={cn("font-semibold")}>Copy URL</div>
							</>
						)}
					</div>
				</Button>
			</form>
		</Form>
	)
}
