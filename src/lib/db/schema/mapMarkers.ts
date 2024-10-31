import { nanoid, timestamps } from "@/lib/utils"
import { sql } from "drizzle-orm"
import {
    jsonb,
    numeric,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { hubEvents } from "./events"
import { hubs } from "./hubs"
import { users } from "./users"

// Base marker columns that both hub and event markers share
const baseMarkerColumns = {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    latitude: numeric("latitude", { precision: 20, scale: 16 }).notNull(),
    longitude: numeric("longitude", { precision: 20, scale: 16 }).notNull(),
    address: text("address").notNull(),
    venue: varchar("venue", { length: 256 }),
    userId: uuid("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
}

// Hub Markers
export const hubMarkers = pgTable("hub_markers", {
    ...baseMarkerColumns,
    hubId: varchar("hub_id", { length: 191 })
        .references(() => hubs.id, { onDelete: "cascade" })
        .notNull()
        .unique(), // One hub can only have one marker
    amenities: jsonb("amenities").$type<string[]>(),
    operatingHours:
        jsonb("operating_hours").$type<
            Record<string, { open: string; close: string }>
        >(),
    object_id: uuid("object_id"),
})

// Hub Marker Schemas
const baseHubMarkerSchema = createSelectSchema(hubMarkers).omit(timestamps)

export const insertHubMarkerSchema = createInsertSchema(hubMarkers)
    .omit(timestamps)
    .omit({
        id: true,
        userId: true,
        object_id: true,
    })

export const insertHubMarkerParams = z.object({
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    address: z.string().min(1),
    venue: z.string().optional(),
    hubId: z.string().min(1),
    amenities: z.array(z.string()).optional(),
    operatingHours: z
        .record(
            z.object({
                open: z.string(),
                close: z.string(),
            }),
        )
        .optional(),
})

// Event Markers
export const eventMarkers = pgTable("event_markers", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    latitude: numeric("latitude", { precision: 8, scale: 6 }).notNull(),
    longitude: numeric("longitude", { precision: 9, scale: 6 }).notNull(),
    address: text("address").notNull(),
    venue: varchar("venue", { length: 256 }),
    userId: uuid("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
    eventId: varchar("event_id", { length: 191 })
        .references(() => hubEvents.id, { onDelete: "cascade" })
        .notNull(),
    eventType: varchar("event_type", { length: 50 }).notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    object_id: uuid("object_id"),
})

// Event Marker Schemas
const baseEventMarkerSchema = createSelectSchema(eventMarkers).omit(timestamps)

export const insertEventMarkerSchema =
    createInsertSchema(eventMarkers).omit(timestamps)

export const insertEventMarkerParams = z.object({
    latitude: z.string(),
    longitude: z.string(),
    address: z.string().min(1),
    venue: z.string().optional(),
    eventId: z.string().min(1),
    eventType: z.string().min(1),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
})

export const updateEventMarkerSchema = baseEventMarkerSchema

export const updateEventMarkerParams = z.object({
    id: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    address: z.string().min(1),
    venue: z.string().optional(),
    eventId: z.string().min(1),
    eventType: z.string().min(1),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
})

export const eventMarkerIdSchema = baseEventMarkerSchema.pick({ id: true })

// Types
export type HubMarker = typeof hubMarkers.$inferSelect
export type NewHubMarker = z.infer<typeof insertHubMarkerSchema>
export type NewHubMarkerParams = z.infer<typeof insertHubMarkerParams>

export type EventMarker = typeof eventMarkers.$inferSelect
export type NewEventMarker = z.infer<typeof insertEventMarkerSchema>
export type NewEventMarkerParams = z.infer<typeof insertEventMarkerParams>
export type UpdateEventMarkerParams = z.infer<typeof updateEventMarkerParams>
export type EventMarkerId = z.infer<typeof eventMarkerIdSchema>["id"]

// Helper function to determine marker type
export const isEventMarker = (
    marker: HubMarker | EventMarker,
): marker is EventMarker => {
    return "eventId" in marker
}
