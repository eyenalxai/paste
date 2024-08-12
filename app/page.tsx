"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { PasteFormSchema, selectContentTypeOptions, selectExpiresAfterOptions, selectLanguageOptions } from "@/lib/form"
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
			expiresAfter: "1-hour",
			contentType: "auto",
			syntax: undefined
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
					toast.info(
						<div className={cn("flex", "flex-row", "gap-4", "justify-between", "items-center", "w-full")}>
							<div>URL copied to clipboard</div>
							{!formData.encrypted && (
								<Button asChild variant={"outline"} className={cn("h-8")}>
									<a target={"_blank"} rel="noopener noreferrer" href={pasteUrl}>
										Open
									</a>
								</Button>
							)}
						</div>
					)
					return pasteUrl
				})
			})
			.then((pasteUrl) => {
				if (!pasteUrl) return

				form.reset({
					content: "",
					oneTime: false,
					encrypted: formData.encrypted,
					contentType: "auto",
					syntax: undefined,
					expiresAfter: "1-hour"
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
					{!form.watch("encrypted") && (
						<FormField
							control={form.control}
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
												{Object.entries(selectContentTypeOptions).map(([key, value]) => (
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
					)}
					{!form.watch("encrypted") && form.watch("contentType") === "source" && (
						<FormField
							control={form.control}
							name="syntax"
							render={({ field }) => (
								<FormItem>
									<div className={cn("flex", "flex-row", "gap-x-2")}>
										<div className={cn("flex", "justify-center", "items-center", "text-center", "whitespace-nowrap")}>
											Syntax
										</div>
										<Select onValueChange={field.onChange} value={field.value || ""}>
											<FormControl>
												<SelectTrigger className={cn("w-56")}>
													<SelectValue placeholder={"Select syntax"}>
														{selectLanguageOptions[field.value as keyof typeof selectLanguageOptions]}
													</SelectValue>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.entries(selectLanguageOptions).map(([key, value]) => (
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
					)}
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
