import { db } from "@/lib/database/client"
import { pastes } from "@/lib/schema"
import { lt } from "drizzle-orm"

export const deleteExpirePastes = async () => {
	const deleted = await db.delete(pastes).where(lt(pastes.expiresAt, new Date().toISOString())).returning()

	if (deleted.length > 0) {
		console.info(`Deleted ${deleted.length} expired pastes`)
	}
}
