import { PasteDisplay } from "@/components/paste-display"
import { getPaste } from "@/lib/select"
import type { Metadata } from "next"

type PageProps = {
	params: {
		uuid: string
	}
}

export async function generateMetadata({ params: { uuid } }: PageProps) {
	const [paste] = await getPaste({ uuid })

	if (!paste) {
		const title = "Paste does not exist or has expired"
		return {
			title: title,
			openGraph: {
				title: title,
				type: "website"
			}
		} satisfies Metadata
	}

	if (paste.encrypted) {
		const title = "Encrypted paste"
		const description = "This paste is encrypted and cannot be previewed"
		return {
			title: title,
			description: description,
			openGraph: {
				title: title,
				description: description,
				type: "website"
			}
		} satisfies Metadata
	}

	const title = "Paste"
	const description = paste.content.length > 64 ? `${paste.content.slice(0, 64)}...` : paste.content

	return {
		title: title,
		description: description,
		openGraph: {
			title: title,
			description: description,
			type: "website"
		}
	} satisfies Metadata
}

export default async function Page({ params: { uuid } }: PageProps) {
	const [paste] = await getPaste({ uuid })

	if (!paste) return <h1>Paste does not exist or has expired</h1>

	return <PasteDisplay uuid={uuid} initialPasteContent={paste.encrypted ? undefined : paste.content} />
}
