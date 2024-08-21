import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

const pool = postgres(process.env.DATABASE_URL, { max: 10 })

await migrate(drizzle(pool), { migrationsFolder: "./drizzle" })

process.exit(0)
