import { db } from "@/lib/database/client"
import { pastes } from "@/lib/schema"
import { and, eq, gt } from "drizzle-orm"
import { cache } from "react"

export const getPaste = cache(async (id: string) => {
	const [paste] = await db
		.select()
		.from(pastes)
		.where(and(eq(pastes.id, id), gt(pastes.expiresAt, new Date().toISOString())))

	return paste
})
