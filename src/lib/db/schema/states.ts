import { sql } from "drizzle-orm"
import {
    varchar,
    text,
    integer,
    date,
    timestamp,
    pgTable,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { regions } from "./regions"
import { type getStates } from "@/lib/api/states/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const states = pgTable("states", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description").notNull(),
    capitalCity: varchar("capital_city", { length: 256 }).notNull(),
    population: integer("population").notNull(),
    approvedAt: date("approved_at"),
    regionId: varchar("region_id", { length: 256 })
        .references(() => regions.id, { onDelete: "cascade" })
        .notNull(),

    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
})

// Schema for states - used to validate API requests
const baseSchema = createSelectSchema(states).omit(timestamps)

export const insertStateSchema = createInsertSchema(states).omit(timestamps)
export const insertStateParams = baseSchema
    .extend({
        population: z.coerce.number(),
        approvedAt: z.coerce.string().min(1),
        regionId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
    })

export const updateStateSchema = baseSchema
export const updateStateParams = baseSchema.extend({
    population: z.coerce.number(),
    approvedAt: z.coerce.string().min(1),
    regionId: z.coerce.string().min(1),
})
export const stateIdSchema = baseSchema.pick({ id: true })

// Types for states - used to type API request params and within Components
export type State = typeof states.$inferSelect
export type NewState = z.infer<typeof insertStateSchema>
export type NewStateParams = z.infer<typeof insertStateParams>
export type UpdateStateParams = z.infer<typeof updateStateParams>
export type StateId = z.infer<typeof stateIdSchema>["id"]

// this type infers the return from getStates() - meaning it will include any joins
export type CompleteState = Awaited<
    ReturnType<typeof getStates>
>["states"][number]
