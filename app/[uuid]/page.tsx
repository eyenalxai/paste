import { PasteDisplay } from "@/components/paste-display"
import { getPaste } from "@/lib/select"

type PageProps = {
	params: {
		uuid: string
	}
}

export default async function Page({ params: { uuid } }: PageProps) {
	const [paste] = await getPaste({ uuid })

	if (!paste) return <h1>Paste does not exist or has expired</h1>

	return <PasteDisplay uuid={uuid} initialPasteContent={paste.encrypted ? undefined : paste.content} />
}
