"use client"

import { PasteForm } from "@/components/paste-form/paste-form"
import { usePasteForm } from "@/lib/hooks/paste-form"
import { FormProvider } from "react-hook-form"

export default function Page() {
	const { methods, onSubmit, isSubmitting, encrypted, contentType } = usePasteForm()

	return (
		<FormProvider {...methods}>
			<PasteForm onSubmit={onSubmit} isSubmitting={isSubmitting} encrypted={encrypted} contentType={contentType} />
		</FormProvider>
	)
}
