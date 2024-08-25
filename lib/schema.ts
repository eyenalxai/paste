import { sql } from "drizzle-orm"
import { boolean, customType, pgTable, text, timestamp } from "drizzle-orm/pg-core"

const bytea = customType<{
	data: Buffer
}>({
	dataType() {
		return "bytea"
	}
})

export const pastes = pgTable("pastes", {
	id: text("id").primaryKey().default(sql`auto_increment_alphanumeric(NEXTVAL('paste_id_seq'))`),
	content: bytea("content").notNull(),
	oneTime: boolean("one_time"),
	ivClientBase64: text("iv_client_base64"),
	ivServer: bytea("iv_server4"),
	syntax: text("syntax").notNull(),
	link: boolean("link").notNull(),
	expiresAt: timestamp("expires_at", { mode: "string", withTimezone: true }).notNull()
})

export type Paste = typeof pastes.$inferSelect
export type PasteInsert = typeof pastes.$inferInsert
