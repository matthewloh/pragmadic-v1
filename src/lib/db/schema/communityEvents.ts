import { type getCommunityEvents } from "@/lib/api/communityEvents/queries"
import { users } from "@/lib/db/schema/users"
import { sql } from "drizzle-orm"
import {
    boolean,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { communities } from "./communities"

import { EVENT_TYPES } from "@/features/events/types"
import { nanoid, timestamps } from "@/lib/utils"

// Community Events
export const communityEvents = pgTable("community_events", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description").notNull(),
    eventTimestamp: timestamp("event_timestamp", { mode: "date" }).notNull(),
    location: varchar("location", { length: 256 }).notNull(),
    eventType: varchar("event_type", { length: 256 }),
    isComplete: boolean("is_complete").notNull(),
    completedAt: timestamp("completed_at", { mode: "date" }),
    communityId: varchar("community_id", { length: 256 })
        .references(() => communities.id, { onDelete: "cascade" })
        .notNull(),
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

// Schema for communityEvents - used to validate API requests
const baseSchema = createSelectSchema(communityEvents).omit(timestamps)

export const insertCommunityEventSchema =
    createInsertSchema(communityEvents).omit(timestamps)
export const insertCommunityEventParams = baseSchema
    .extend({
        eventTimestamp: z.coerce.date(),
        isComplete: z.coerce.boolean(),
        completedAt: z.coerce.date(),
        communityId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
        userId: true,
    })

export const updateCommunityEventSchema = baseSchema
export const updateCommunityEventParams = baseSchema
    .extend({
        eventTimestamp: z.coerce.date(),
        isComplete: z.coerce.boolean(),
        completedAt: z.coerce.date(),
        communityId: z.coerce.string().min(1),
    })
    .omit({
        userId: true,
    })
export const communityEventIdSchema = baseSchema.pick({ id: true })

// Types for communityEvents - used to type API request params and within Components
export type CommunityEvent = typeof communityEvents.$inferSelect
export type NewCommunityEvent = z.infer<typeof insertCommunityEventSchema>
export type NewCommunityEventParams = z.infer<typeof insertCommunityEventParams>
export type UpdateCommunityEventParams = z.infer<
    typeof updateCommunityEventParams
>
export type CommunityEventId = z.infer<typeof communityEventIdSchema>["id"]

// this type infers the return from getCommunityEvents() - meaning it will include any joins
export type CompleteCommunityEvent = Awaited<
    ReturnType<typeof getCommunityEvents>
>["communityEvents"][number]
