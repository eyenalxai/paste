import { PasteContainer } from "@/components/paste-container"

type PasteErrorProps = {
	title: string
	description: string
}

export const PasteError = ({ title, description }: PasteErrorProps) => (
	<PasteContainer
		error={{
			title,
			description
		}}
	/>
)
