import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core"

export const pastes = pgTable("pastes", {
	uuid: uuid("uuid").primaryKey().defaultRandom(),
	content: text("content").notNull(),
	oneTime: boolean("one_time")
})

export type PasteInsert = Omit<typeof pastes.$inferSelect, "createdAt" | "uuid">
export type Paste = typeof pastes.$inferSelect
