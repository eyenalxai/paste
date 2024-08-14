"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { env } from "@/lib/env.mjs"
import {
	PasteFormSchema,
	type Syntax,
	selectContentTypeOptions,
	selectExpiresAfterOptions,
	selectSyntaxOptions
} from "@/lib/form"
import { savePaste } from "@/lib/paste/save-paste"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Copy } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

export default function Page() {
	const form = useForm<z.infer<typeof PasteFormSchema>>({
		resolver: zodResolver(PasteFormSchema),
		defaultValues: {
			content: "",
			encrypted: false,
			oneTime: false,
			expiresAfter: "1-hour",
			contentType: !env.NEXT_PUBLIC_OPENAI_CLASSIFICATION_ENABLED ? "plaintext" : "auto",
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

				if (navigator.clipboard?.writeText === undefined) {
					toast.error("Clipboard API not available, probably because connection is not secure")
					return
				}

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
					oneTime: formData.oneTime,
					encrypted: formData.encrypted,
					contentType: formData.contentType,
					syntax: formData.syntax,
					expiresAfter: "1-hour"
				})
			})
	}

	const contentType = form.watch("contentType")

	useEffect(() => {
		if (contentType !== "source") {
			form.setValue("syntax", undefined)
		}
	}, [contentType, form, form.setValue])

	useEffect(() => {
		if (form.formState.errors) {
			for (const path in form.formState.errors) {
				const message = form.formState.errors[path as keyof typeof form.formState.errors]?.message
				if (message) toast.error(message)
			}
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
											{Object.entries(selectContentTypeOptions).map(([key, value]) => {
												if (key === "auto" && !env.NEXT_PUBLIC_OPENAI_CLASSIFICATION_ENABLED) return

												if (form.watch("encrypted") && key === "auto") return null
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
					{contentType === "source" && (
						<FormField
							control={form.control}
							name="syntax"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<div className={cn("flex", "flex-row", "gap-x-2")}>
										<div className={cn("flex", "justify-center", "items-center", "text-center", "whitespace-nowrap")}>
											Syntax
										</div>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															"w-[200px] justify-between font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? selectSyntaxOptions[field.value as z.infer<typeof Syntax>] : "Select syntax"}
														<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-[200px] p-0">
												<Command>
													<CommandInput placeholder="Search syntax..." />
													<CommandList>
														<CommandEmpty>No syntax found.</CommandEmpty>
														<CommandGroup>
															{Object.entries(selectSyntaxOptions)
																.sort(([_a, a], [_b, b]) => a.localeCompare(b))
																.map(([key, value]) => (
																	<CommandItem
																		key={key}
																		value={value}
																		onSelect={() => {
																			form.setValue("syntax", key as z.infer<typeof Syntax>)
																		}}
																	>
																		<Check
																			className={cn("mr-2 size-4", key === field.value ? "opacity-100" : "opacity-0")}
																		/>
																		{value}
																	</CommandItem>
																))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
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
