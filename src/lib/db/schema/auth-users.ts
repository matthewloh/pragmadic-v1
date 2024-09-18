import { timestamps } from "@/lib/utils"
import { sql } from "drizzle-orm"
import {
    pgSchema,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

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
const baseSchema = createSelectSchema(users)
export const userIdSchema = baseSchema.pick({ id: true })
export type UserId = z.infer<typeof userIdSchema>["id"]
