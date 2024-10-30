import { type Config, defineConfig } from "drizzle-kit"

export default defineConfig({
    schemaFilter: ["public"],
    schema: "./src/lib/db/schema",
    out: "./supabase/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DIRECT_URL!,
        // host: process.env.DATABASE_HOST!,
        // user: process.env.DATABASE_USER!,
        // password: process.env.DATABASE_PASSWORD!,
        // database: process.env.DATABASE_NAME!,
        // port:5432
    },
} as Config)
