import { SelectContentType } from "@/components/paste-form/select-content-type"
import { SelectExpiresAfter } from "@/components/paste-form/select-expires-after"
import { SelectOnetime } from "@/components/paste-form/select-onetime"
import { SelectSyntax } from "@/components/paste-form/select-syntax"
import { SubmitButton } from "@/components/paste-form/submit-button"
import { SwitchEncrypted } from "@/components/paste-form/switch-encrypted"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { ContentType } from "@/lib/zod/form/common"
import type { FrontendSchema } from "@/lib/zod/form/frontend"
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
			<form onSubmit={methods.handleSubmit(onSubmit)} className={cn("space-y-4", "mb-16")}>
				<div className={cn("flex", "flex-row", "flex-wrap", "gap-4", "justify-between", "items-center")}>
					<div className={cn("flex", "flex-row", "flex-wrap", "gap-4", "justify-start", "items-center")}>
						<SwitchEncrypted />
						<SelectOnetime />
						<SelectExpiresAfter />
						<SelectContentType encrypted={encrypted} />
						<SelectSyntax contentType={contentType} />
					</div>
					<SubmitButton isSubmitting={isSubmitting} />
				</div>
				<FormField
					control={methods.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea
									autoFocus
									className={cn(["min-h-[50vh]", "lg:min-h-[80vh]"], "font-mono")}
									autoResize
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
