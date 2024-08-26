import { type ForwardedRef, useEffect, useImperativeHandle, useRef } from "react"

export const useAutoResizeTextarea = (ref: ForwardedRef<HTMLTextAreaElement>, autoResize: boolean) => {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null)

	useImperativeHandle(ref, () => {
		if (textareaRef.current) {
			return textareaRef.current
		}
		throw new Error("textarea ref is not assigned")
	})

	useEffect(() => {
		const ref = textareaRef?.current

		const updateTextareaHeight = () => {
			if (ref && autoResize) {
				ref.style.height = "auto"
				ref.style.height = `${ref.scrollHeight + 2}px`

				window.scrollTo({
					top: ref.scrollHeight + 50,
					left: 0
				})
			}
		}

		updateTextareaHeight()

		ref?.addEventListener("input", updateTextareaHeight)

		return () => ref?.removeEventListener("input", updateTextareaHeight)
	}, [autoResize])

	return { textareaRef }
}
