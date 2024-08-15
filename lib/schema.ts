import { boolean, customType, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

const bytea = customType<{
	data: Buffer
}>({
	dataType() {
		return "bytea"
	}
})

export const pastes = pgTable("pastes", {
	uuid: uuid("uuid").primaryKey().defaultRandom(),
	content: bytea("content").notNull(),
	oneTime: boolean("one_time"),
	ivClientBase64: text("iv_client_base64"),
	ivServer: bytea("iv_server4").notNull(),
	syntax: varchar("syntax").notNull(),
	link: boolean("link").notNull(),
	expiresAt: timestamp("expires_at", { mode: "string", withTimezone: true }).notNull()
})

export type Paste = typeof pastes.$inferSelect
