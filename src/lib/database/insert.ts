import { db } from "@/lib/database/client"
import { getErrorMessage } from "@/lib/error-message"
import { type PasteInsert, pastes } from "@/lib/schema"
import { ResultAsync } from "neverthrow"

export const insertPaste = (paste: PasteInsert) => {
	return ResultAsync.fromPromise(db.insert(pastes).values(paste).returning(), (e) =>
		getErrorMessage(e, "Failed to insert paste")
	).map(([insertedPaste]) => insertedPaste)
}
