import { db } from "@/lib/database/client"
import { type PasteInsert, pastes } from "@/lib/schema"

export const insertPaste = async (paste: PasteInsert) => db.insert(pastes).values(paste).returning()
