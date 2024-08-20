import { isMacOs } from "react-device-detect"

export const getSaveShortcut = () => {
	if (isMacOs) return "S"
	return "Ctrl+S"
}
