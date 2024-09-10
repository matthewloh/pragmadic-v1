import { sql } from "drizzle-orm"
import {
    pgSchema,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core"

const authSchema = pgSchema("auth")

export const authUsers = authSchema.table("users", {
    id: uuid("id").primaryKey(),
})

export const users = pgTable("user", {
    createdAt: timestamp("created_at").defaultNow(),
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey()
        .notNull()
        .references(() => authUsers.id, { onDelete: "cascade" }),
    email: text("email"),
    display_name: varchar("display_name", { length: 256 }),
    image_url: text("image_url"),
})

export type SelectUser = typeof users.$inferSelect
