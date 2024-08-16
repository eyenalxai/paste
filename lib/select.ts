import { db } from "@/lib/database"
import { pastes } from "@/lib/schema"
import { and, eq, gt, sql } from "drizzle-orm"
import { cache } from "react"

export const getPaste = cache(
	async (id: string) =>
		await db
			.select()
			.from(pastes)
			.where(and(eq(pastes.id, id), gt(pastes.expiresAt, new Date().toISOString())))
)

export const pasteIdExists = async (id: string) => {
	const [{ exists }] = await db.execute(
		sql`select exists (select 1 from ${pastes} where ${pastes.id} = ${id}) as exists`
	)

	return exists as boolean
}
