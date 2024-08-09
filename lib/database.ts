import "server-only"

import { env } from "@/lib/env"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const pool = postgres(env.DATABASE_URL, { max: 1 })

export const db = drizzle(pool)
