import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const pastes = pgTable("pastes", {
	uuid: uuid("uuid").primaryKey().defaultRandom(),
	content: text("content").notNull(),
	oneTime: boolean("one_time"),
	ivClientBase64: text("iv_client_base64"),
	ivServerBase64: text("iv_server_base64").notNull(),
	syntax: varchar("syntax").notNull(),
	link: boolean("link").notNull(),
	expiresAt: timestamp("expires_at", { mode: "string", withTimezone: true }).notNull()
})

export type Paste = typeof pastes.$inferSelect
