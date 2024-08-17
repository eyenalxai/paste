import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { FormControl, FormField, FormItem } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type Syntax, selectSyntaxOptions } from "@/lib/syntax/select"
import { cn } from "@/lib/utils"
import type { ContentType } from "@/lib/zod/form/common"
import type { FrontendSchema } from "@/lib/zod/form/frontend"
import { Check, ChevronsUpDown } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type { z } from "zod"

type SelectSyntaxProps = {
	contentType: z.infer<typeof ContentType>
}

export const SelectSyntax = ({ contentType }: SelectSyntaxProps) => {
	const methods = useFormContext<z.infer<typeof FrontendSchema>>()

	if (contentType !== "source") return null

	return (
		<FormField
			control={methods.control}
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
										className={cn("w-[200px] justify-between font-normal", !field.value && "text-muted-foreground")}
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
															methods.setValue("syntax", key as z.infer<typeof Syntax>)
														}}
													>
														<Check className={cn("mr-2 size-4", key === field.value ? "opacity-100" : "opacity-0")} />
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
	)
}
