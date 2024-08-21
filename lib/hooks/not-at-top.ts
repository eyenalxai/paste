import { useEffect, useState } from "react"

export function useNotAtTop() {
	const [isNotAtTop, setIsNotAtTop] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			console.log(window.scrollY)
			setIsNotAtTop(window.scrollY > 256)
		}

		window.addEventListener("scroll", handleScroll, { passive: true })
		handleScroll()

		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])

	return isNotAtTop
}
