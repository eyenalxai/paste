import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { PasteFormSchema } from "@/lib/form"
import { savePaste } from "@/lib/paste/save-paste"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

export const PasteForm = () => {
	const form = useForm<z.infer<typeof PasteFormSchema>>({
		resolver: zodResolver(PasteFormSchema),
		defaultValues: {
			encrypted: true
		}
	})

	const onSubmit = async (formData: z.infer<typeof PasteFormSchema>) => {
		const pasteUrl = await savePaste(formData)
		form.reset({
			content: "",
			encrypted: formData.encrypted
		})
	}

	useEffect(() => {
		if (form.formState.errors.content?.message) {
			toast.error(form.formState.errors.content.message)
			form.reset({
				content: ""
			})
		}
	}, [form.formState.errors, form.reset, form])

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4")}>
				<FormField
					control={form.control}
					name="encrypted"
					render={({ field }) => (
						<div className={cn("flex", "flex-row", "gap-x-2")}>
							<FormControl>
								<Switch checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
							<div className={cn("flex", "justify-center", "items-center", "text-center")}>Encrypt</div>
						</div>
					)}
				/>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea placeholder="Tell us a little bit about yourself" className={"h-[80vh]"} {...field} />
							</FormControl>
						</FormItem>
					)}
				/>

				<Button type="submit">Submit</Button>
			</form>
		</Form>
	)
}
