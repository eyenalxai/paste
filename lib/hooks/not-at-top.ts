import { useEffect, useState } from "react"

export function useNotAtTop() {
	const [isNotAtTop, setIsNotAtTop] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setIsNotAtTop(window.scrollY > 128)
		}

		window.addEventListener("scroll", handleScroll, { passive: true })
		handleScroll()

		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])

	return isNotAtTop
}
