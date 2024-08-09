import { sql } from "drizzle-orm"
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const pastes = pgTable("pastes", {
	uuid: uuid("uuid").primaryKey().defaultRandom(),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").default(sql`now()`)
})

export type PasteInsert = Omit<typeof pastes.$inferSelect, "createdAt" | "uuid">
export type Paste = typeof pastes.$inferSelect
