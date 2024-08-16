import { PasteAlert } from "@/components/error/paste-alert"
import { PasteContainer } from "@/components/paste-container"

type PasteErrorProps = {
	title: string
	description: string
}

export const PasteError = ({ title, description }: PasteErrorProps) => (
	<PasteContainer error={<PasteAlert title={title} description={description} />} />
)
