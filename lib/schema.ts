import type { Language } from "@/lib/detect-language"
import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const pastes = pgTable("pastes", {
	uuid: uuid("uuid").primaryKey().defaultRandom(),
	content: text("content").notNull(),
	oneTime: boolean("one_time"),
	encrypted: boolean("encrypted").notNull(),
	language: varchar("language").$type<Language>(),
	expiresAt: timestamp("expires_at", { mode: "string", withTimezone: true }).notNull()
})

export type PasteInsert = Omit<typeof pastes.$inferSelect, "createdAt" | "uuid">
export type Paste = typeof pastes.$inferSelect
