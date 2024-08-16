import { db } from "@/lib/database"
import { generateRandomId } from "@/lib/random-id"
import { type Paste, type PasteInsert, type PasteInsertNoId, pastes } from "@/lib/schema"
import { and, eq, gt } from "drizzle-orm"
import type { PostgresError } from "postgres"
import { cache } from "react"

export const getPaste = cache(
	async (id: string) =>
		await db
			.select()
			.from(pastes)
			.where(and(eq(pastes.id, id), gt(pastes.expiresAt, new Date().toISOString())))
)

const insertPasteInternal = async (paste: PasteInsert): Promise<Paste> => {
	const [insertedPaste] = await db.insert(pastes).values(paste).returning()
	return insertedPaste
}

export const insertPaste = async (paste: PasteInsertNoId, id?: string, retryCount = 10): Promise<Paste> => {
	if (retryCount === 0) throw new Error("ID collision retry limit reached")

	try {
		return await insertPasteInternal({ ...paste, id: id ? id : generateRandomId() })
	} catch (error) {
		const pgError = error as unknown as PostgresError

		if ("code" in pgError && pgError.code === "23505") {
			console.log("ID collision, retrying with a new ID")
			return await insertPaste(paste, generateRandomId(), retryCount - 1)
		}

		throw error
	}
}
