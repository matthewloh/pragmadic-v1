import { type Config, defineConfig } from "drizzle-kit"

export default defineConfig({
    schemaFilter: ["public"],
    schema: "./src/lib/db/schema",
    out: "./supabase/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
} as Config)
