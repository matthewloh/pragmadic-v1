import { sql } from "drizzle-orm"
import { varchar, text, boolean, timestamp, pgTable } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { states } from "./states"
import { type getHubs } from "@/lib/api/hubs/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const hubs = pgTable("hubs", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    typeOfHub: varchar("type_of_hub", { length: 256 }).notNull(),
    public: boolean("public").notNull(),
    info: text("info"),
    stateId: varchar("state_id", { length: 256 })
        .references(() => states.id, { onDelete: "cascade" })
        .notNull(),
    userId: varchar("user_id", { length: 256 }).notNull(),

    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
})

// Schema for hubs - used to validate API requests
const baseSchema = createSelectSchema(hubs).omit(timestamps)

export const insertHubSchema = createInsertSchema(hubs).omit(timestamps)
export const insertHubParams = baseSchema
    .extend({
        public: z.coerce.boolean(),
        stateId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
        userId: true,
    })

export const updateHubSchema = baseSchema
export const updateHubParams = baseSchema
    .extend({
        public: z.coerce.boolean(),
        stateId: z.coerce.string().min(1),
    })
    .omit({
        userId: true,
    })
export const hubIdSchema = baseSchema.pick({ id: true })

// Types for hubs - used to type API request params and within Components
export type Hub = typeof hubs.$inferSelect
export type NewHub = z.infer<typeof insertHubSchema>
export type NewHubParams = z.infer<typeof insertHubParams>
export type UpdateHubParams = z.infer<typeof updateHubParams>
export type HubId = z.infer<typeof hubIdSchema>["id"]

// this type infers the return from getHubs() - meaning it will include any joins
export type CompleteHub = Awaited<ReturnType<typeof getHubs>>["hubs"][number]
