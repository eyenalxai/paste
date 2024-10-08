"use client"
import { getSelectorsByUserAgent } from "react-device-detect"

import { FailedToCopyUrl } from "@/components/failed-to-copy-url"
import { copyToClipboard } from "@/lib/clipboard"
import { env } from "@/lib/env.mjs"
import { wrapInMarkdown } from "@/lib/markdown"
import { savePasteForm } from "@/lib/paste/save-paste-form"
import { userAgent } from "@/lib/user-agent"
import { cn } from "@/lib/utils"
import { FrontendSchema } from "@/lib/zod/form/frontend"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

export const usePasteForm = () => {
	const [submittedPaste, setSubmittedPaste] = useState<{
		id: string
		url: string
		rawContent: string
		syntax: string | undefined
		oneTime: boolean
		markdownContent: string
	} | null>(null)
	const [isSubmitting, startTransition] = useTransition()

	const methods = useForm<z.infer<typeof FrontendSchema>>({
		resolver: zodResolver(FrontendSchema),
		defaultValues: {
			content: "",
			encrypted: env.NEXT_PUBLIC_CLIENT_SIDE_ENCRYPTION_ONLY,
			oneTime: false,
			expiresAfter: "1-hour",
			contentType: !env.NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION ? "plaintext" : "auto",
			syntax: ""
		}
	})

	const { isDesktop } = getSelectorsByUserAgent(userAgent())

	const onSubmit = useCallback(
		async (formData: z.infer<typeof FrontendSchema>) => {
			startTransition(async () => {
				await savePasteForm(formData).match(
					(data) => {
						setSubmittedPaste({
							id: data.id,
							url: data.url,
							rawContent: formData.content,
							syntax: data.syntax,
							oneTime: formData.oneTime,
							markdownContent: wrapInMarkdown({ syntax: data.syntax, content: formData.content })
						})

						history.pushState(null, "", data.url)

						copyToClipboard(data.url).match(
							() => toast.info(<div className={cn("select-none")}>URL copied to clipboard</div>),
							(error) =>
								toast.error(isDesktop ? <FailedToCopyUrl error={error} content={data.url} /> : "Failed to copy URL")
						)

						methods.reset({
							content: "",
							oneTime: formData.oneTime,
							encrypted: formData.encrypted,
							contentType: formData.contentType,
							syntax: formData.syntax,
							expiresAfter: formData.expiresAfter
						})
					},
					(error) => toast.error(error)
				)
			})
		},
		[methods.reset, isDesktop]
	)

	const contentType = methods.watch("contentType")
	const encrypted = methods.watch("encrypted")

	useEffect(() => {
		if (encrypted && contentType === "auto") {
			methods.setValue("contentType", "plaintext")
		}

		if (contentType !== "source") {
			methods.setValue("syntax", "")
		}
	}, [contentType, encrypted, methods, methods.setValue])

	useEffect(() => {
		if (methods.formState.errors) {
			for (const path in methods.formState.errors) {
				const message = methods.formState.errors[path as keyof typeof methods.formState.errors]?.message
				if (message) toast.error(message)
			}
		}
	}, [methods.formState.errors, methods])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "s") {
				e.preventDefault()
				methods.handleSubmit(onSubmit)()
			}
		}

		window.addEventListener("keydown", handleKeyDown)

		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [methods.handleSubmit, onSubmit, methods])

	return { methods, onSubmit, isSubmitting, encrypted, contentType, submittedPaste, setSubmittedPaste }
}
