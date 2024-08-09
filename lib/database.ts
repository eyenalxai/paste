import "server-only"
import { serverEnv } from "@/lib/env/server"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const pool = postgres(serverEnv.databaseUrl, { max: 1 })

export const db = drizzle(pool)
