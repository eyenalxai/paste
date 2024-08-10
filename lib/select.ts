import { db } from "@/lib/database"
import { pastes } from "@/lib/schema"
import { and, eq, gt } from "drizzle-orm"
import { cache } from "react"

type GetPasteProps = {
	uuid: string
}

export const getPaste = cache(
	async ({ uuid }: GetPasteProps) =>
		await db
			.select()
			.from(pastes)
			.where(and(eq(pastes.uuid, uuid), gt(pastes.expiresAt, new Date().toISOString())))
)
