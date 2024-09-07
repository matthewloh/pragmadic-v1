import { sql } from "drizzle-orm"
import {
    varchar,
    text,
    date,
    boolean,
    timestamp,
    pgTable,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { hubs } from "./hubs"
import { type getEvents } from "@/lib/api/events/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const events = pgTable("events", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description").notNull(),
    typeOfEvent: varchar("type_of_event", { length: 256 }).notNull(),
    eventDate: date("event_date").notNull(),
    completionDate: date("completion_date"),
    isComplete: boolean("is_complete").notNull(),
    info: text("info"),
    hubId: varchar("hub_id", { length: 256 })
        .references(() => hubs.id, { onDelete: "cascade" })
        .notNull(),
    userId: varchar("user_id", { length: 256 }).notNull(),

    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
})

// Schema for events - used to validate API requests
const baseSchema = createSelectSchema(events).omit(timestamps)

export const insertEventSchema = createInsertSchema(events).omit(timestamps)
export const insertEventParams = baseSchema
    .extend({
        eventDate: z.coerce.string().min(1),
        completionDate: z.coerce.string().min(1),
        isComplete: z.coerce.boolean(),
        hubId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
        userId: true,
    })

export const updateEventSchema = baseSchema
export const updateEventParams = baseSchema
    .extend({
        eventDate: z.coerce.string().min(1),
        completionDate: z.coerce.string().min(1),
        isComplete: z.coerce.boolean(),
        hubId: z.coerce.string().min(1),
    })
    .omit({
        userId: true,
    })
export const eventIdSchema = baseSchema.pick({ id: true })

// Types for events - used to type API request params and within Components
export type Event = typeof events.$inferSelect
export type NewEvent = z.infer<typeof insertEventSchema>
export type NewEventParams = z.infer<typeof insertEventParams>
export type UpdateEventParams = z.infer<typeof updateEventParams>
export type EventId = z.infer<typeof eventIdSchema>["id"]

// this type infers the return from getEvents() - meaning it will include any joins
export type CompleteEvent = Awaited<
    ReturnType<typeof getEvents>
>["events"][number]
