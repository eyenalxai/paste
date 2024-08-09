"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { savePaste } from "@/lib/fetch/paste"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const FormSchema = z.object({
	content: z.string().min(16, {
		message: "Paste must be at least 16 characters long"
	})
})

export default function Home() {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema)
	})

	const onSubmit = (formData: z.infer<typeof FormSchema>) => {
		savePaste({
			content: formData.content
		})
			.then(() => {
				toast.success("Paste saved successfully")
			})
			.catch((reason: Error) => {
				toast.error(reason.message)
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
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	)
}
