import { getPaste } from "@/lib/fetch/paste"
import { useQuery } from "@tanstack/react-query"

type UsePasteProps = {
	uuid: string
}

export const usePaste = ({ uuid }: UsePasteProps) => {
	const {
		data: paste,
		isLoading,
		error
	} = useQuery({
		queryKey: ["paste", uuid],
		queryFn: () => getPaste(uuid)
	})

	return { paste, isLoading, error }
}
