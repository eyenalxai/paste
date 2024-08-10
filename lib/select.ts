import { db } from "@/lib/database"
import { pastes } from "@/lib/schema"
import { and, eq, gt } from "drizzle-orm"

type GetPasteProps = {
	uuid: string
}

export const getPaste = async ({ uuid }: GetPasteProps) =>
	await db
		.select()
		.from(pastes)
		.where(and(eq(pastes.uuid, uuid), gt(pastes.expiresAt, new Date().toISOString())))
