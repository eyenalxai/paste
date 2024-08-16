export const extractIdAndExtension = (idWithExt: string): [string, string | undefined] => {
	const [id, extension] = idWithExt.split(".")
	return [id, extension]
}
