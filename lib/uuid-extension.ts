export const extractUuidAndExtension = (uuidWithExt: string): [string, string | undefined] => {
	const [uuid, extension] = uuidWithExt.split(".")
	return [uuid, extension]
}
