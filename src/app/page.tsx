"use client"

import { PasteContainer } from "@/components/paste-container"
import { PasteForm } from "@/components/paste-form/paste-form"
import { usePasteForm } from "@/lib/hooks/paste-form"
import { FormProvider } from "react-hook-form"

export default function Page() {
	const { methods, onSubmit, isSubmitting, encrypted, contentType, submittedPaste, setSubmittedPaste } = usePasteForm()

	if (submittedPaste !== null)
		return (
			<PasteContainer
				noWrap
				preview
				resetFn={() => setSubmittedPaste(null)}
				id={submittedPaste.id}
				content={submittedPaste.rawContent}
				oneTime={submittedPaste.oneTime}
				markdown={submittedPaste.markdownContent}
			/>
		)

	return (
		<FormProvider {...methods}>
			<PasteForm onSubmit={onSubmit} isSubmitting={isSubmitting} encrypted={encrypted} contentType={contentType} />
		</FormProvider>
	)
}
