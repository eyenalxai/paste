"use client"

import { ToastPasteSaved } from "@/components/toast-paste-saved"
import { copyToClipboard } from "@/lib/clipboard"
import { env } from "@/lib/env.mjs"
import { savePasteForm } from "@/lib/paste/save-paste-form"
import { FrontendSchema } from "@/lib/zod/form/frontend"
import { zodResolver } from "@hookform/resolvers/zod"
import { ok } from "neverthrow"
import { useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

export const usePasteForm = () => {
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

	const onSubmit = async (formData: z.infer<typeof FrontendSchema>) => {
		startTransition(async () => {
			await savePasteForm(formData)
				.andThen((url) => copyToClipboard(url).andThen(() => ok(url)))
				.match(
					(url) => {
						!formData.oneTime
							? window.open(url, "_blank")
							: toast.info(<ToastPasteSaved url={url} encrypted={formData.encrypted} oneTime={formData.oneTime} />)

						methods.reset({
							content: "",
							oneTime: formData.oneTime,
							encrypted: formData.encrypted,
							contentType: formData.contentType,
							syntax: formData.syntax,
							expiresAfter: "1-hour"
						})
					},
					(error) => {
						toast.error(error)
					}
				)
		})
	}

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

	return { methods, onSubmit, isSubmitting, encrypted, contentType }
}
