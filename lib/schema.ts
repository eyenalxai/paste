import type { PasteContent } from "@/lib/types"
import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core"

export const pastes = pgTable("pastes", {
	uuid: uuid("uuid").notNull().defaultRandom(),
	pasteContent: jsonb("content").$type<PasteContent>().notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow()
})

export type PasteInsert = typeof pastes.$inferSelect
