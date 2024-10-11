import { sql } from "drizzle-orm"
import {
    varchar,
    text,
    boolean,
    timestamp,
    pgTable,
    uuid,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { type getRegions } from "@/lib/api/regions/queries"

import { nanoid, timestamps } from "@/lib/utils"
import { users } from "./users"

export const regions = pgTable("regions", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    public: boolean("public").notNull(),
    userId: uuid("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
})

// Schema for regions - used to validate API requests
const baseSchema = createSelectSchema(regions).omit(timestamps)

export const insertRegionSchema = createInsertSchema(regions).omit(timestamps)
export const insertRegionParams = baseSchema
    .extend({
        public: z.coerce.boolean(),
    })
    .omit({
        id: true,
        userId: true,
    })

export const updateRegionSchema = baseSchema
export const updateRegionParams = baseSchema
    .extend({
        public: z.coerce.boolean(),
    })
    .omit({
        userId: true,
    })
export const regionIdSchema = baseSchema.pick({ id: true })

// Types for regions - used to type API request params and within Components
export type Region = typeof regions.$inferSelect
export type NewRegion = z.infer<typeof insertRegionSchema>
export type NewRegionParams = z.infer<typeof insertRegionParams>
export type UpdateRegionParams = z.infer<typeof updateRegionParams>
export type RegionId = z.infer<typeof regionIdSchema>["id"]

// this type infers the return from getRegions() - meaning it will include any joins
export type CompleteRegion = Awaited<
    ReturnType<typeof getRegions>
>["regions"][number]
