import { exhaustiveCheck } from "@/lib/utils"
import { isMacOs } from "react-device-detect"

export const getKeyboardShortcut = (type: "copy" | "save"): string => {
	if (type === "copy") {
		if (isMacOs) return "C"
		return "Ctrl+C"
	}

	if (type === "save") {
		if (isMacOs) return "S"
		return "Ctrl+S"
	}

	return exhaustiveCheck(type)
}
