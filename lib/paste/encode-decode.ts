export const pasteContentToBase64 = async (pasteContent: string) => {
	return {
		contentBase64: window.btoa(pasteContent)
	}
}

export const pasteContentFromBase64 = (contentBase64: string) => {
	return window.atob(contentBase64)
}