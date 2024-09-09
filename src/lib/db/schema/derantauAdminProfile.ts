import { sql } from "drizzle-orm"
import { varchar, timestamp, pgTable, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { regions } from "./regions"
import { userTable } from "@/lib/db/schema/auth-users"
import { type getDerantauAdminProfiles } from "@/lib/api/derantauAdminProfile/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const derantauAdminProfile = pgTable("derantau_admin_profile", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    department: varchar("department", { length: 256 }).notNull(),
    position: varchar("position", { length: 256 }).notNull(),
    adminLevel: varchar("admin_level", { length: 256 }).notNull(),
    regionId: varchar("region_id", { length: 256 })
        .references(() => regions.id)
        .notNull(),
    userId: uuid("user_id")
        .references(() => userTable.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
})

// Schema for derantauAdminProfile - used to validate API requests
const baseSchema = createSelectSchema(derantauAdminProfile).omit(timestamps)

export const insertDerantauAdminProfileSchema =
    createInsertSchema(derantauAdminProfile).omit(timestamps)
export const insertDerantauAdminProfileParams = baseSchema
    .extend({
        regionId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
        userId: true,
    })

export const updateDerantauAdminProfileSchema = baseSchema
export const updateDerantauAdminProfileParams = baseSchema
    .extend({
        regionId: z.coerce.string().min(1),
    })
    .omit({
        userId: true,
    })
export const derantauAdminProfileIdSchema = baseSchema.pick({ id: true })

// Types for derantauAdminProfile - used to type API request params and within Components
export type DerantauAdminProfile = typeof derantauAdminProfile.$inferSelect
export type NewDerantauAdminProfile = z.infer<
    typeof insertDerantauAdminProfileSchema
>
export type NewDerantauAdminProfileParams = z.infer<
    typeof insertDerantauAdminProfileParams
>
export type UpdateDerantauAdminProfileParams = z.infer<
    typeof updateDerantauAdminProfileParams
>
export type DerantauAdminProfileId = z.infer<
    typeof derantauAdminProfileIdSchema
>["id"]

// this type infers the return from getDerantauAdminProfile() - meaning it will include any joins
export type CompleteDerantauAdminProfile = Awaited<
    ReturnType<typeof getDerantauAdminProfiles>
>["derantauAdminProfile"][number]
