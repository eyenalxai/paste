"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { PasteFormSchema, selectExpiresAfterOptions } from "@/lib/form"
import { savePaste } from "@/lib/paste/save-paste"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Copy } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

export default function Page() {
	const form = useForm<z.infer<typeof PasteFormSchema>>({
		resolver: zodResolver(PasteFormSchema),
		defaultValues: {
			content: "",
			encrypted: true,
			oneTime: false,
			expiresAfter: "1-hour"
		}
	})

	const onSubmit = async (formData: z.infer<typeof PasteFormSchema>) => {
		savePaste(formData)
			.catch((error: Error) => {
				toast.error(error.message)
				return undefined
			})
			.then((pasteUrl) => {
				if (!pasteUrl) return

				return navigator.clipboard.writeText(pasteUrl).then(() => {
					toast.info("URL copied to clipboard")
					return pasteUrl
				})
			})
			.then((pasteUrl) => {
				if (!pasteUrl) return

				form.reset({
					content: "",
					encrypted: formData.encrypted
				})
			})
	}

	useEffect(() => {
		if (form.formState.errors.content?.message) {
			toast.error(form.formState.errors.content.message)
		}
	}, [form.formState.errors, form])

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4")}>
				<div className={cn("flex", "flex-row", "flex-wrap", "gap-4", "justify-start", "items-center")}>
					<FormField
						control={form.control}
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
					<FormField
						control={form.control}
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
					<FormField
						control={form.control}
						name="expiresAfter"
						render={({ field }) => (
							<FormItem>
								<div className={cn("flex", "flex-row", "gap-x-2")}>
									<div className={cn("flex", "justify-center", "items-center", "text-center", "whitespace-nowrap")}>
										Expires after
									</div>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className={cn("w-32")}>
												<SelectValue>{field.value}</SelectValue>
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
				</div>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea className={cn("h-[80vh]", "font-mono")} {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<Button type="submit">
					<div className={cn("flex", "flex-row", "gap-x-2", "items-center")}>
						<Copy />
						<div className={cn("font-semibold")}>Copy URL</div>
					</div>
				</Button>
			</form>
		</Form>
	)
}
