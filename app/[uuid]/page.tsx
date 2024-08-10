import { PasteDisplay } from "@/components/paste-display"

type PageProps = {
	params: {
		uuid: string
	}
}

export default function Page({ params: { uuid } }: PageProps) {
	return <PasteDisplay uuid={uuid} />
}
