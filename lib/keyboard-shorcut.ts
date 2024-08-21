import { userAgent } from "@/lib/user-agent"
import { exhaustiveCheck } from "@/lib/utils"
import { getSelectorsByUserAgent } from "react-device-detect"

export const getKeyboardShortcut = (type: "copy" | "save"): string => {
	const { isMacOs } = getSelectorsByUserAgent(userAgent())

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
