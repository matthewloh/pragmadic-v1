import { type getEvents } from "@/lib/api/events/queries"
import { relations, sql } from "drizzle-orm"
import {
    boolean,
    date,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { hubs } from "./hubs"

import { nanoid, timestamps } from "@/lib/utils"
import { users } from "./users"
import { inviteRoleType, inviteStatusEnum } from "../shared-enums/invites"

// Hub Events
export const hubEvents = pgTable("hub_events", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description").notNull(),
    typeOfEvent: varchar("type_of_event", { length: 256 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    isComplete: boolean("is_complete").notNull(),
    info: text("info"),
    hubId: varchar("hub_id", { length: 256 })
        .references(() => hubs.id, { onDelete: "cascade" })
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

// Schema for events - used to validate API requests
const baseSchema = createSelectSchema(hubEvents).omit(timestamps)

export const insertEventSchema = createInsertSchema(hubEvents).omit(timestamps)
export const insertEventParams = baseSchema
    .extend({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        completionDate: z.coerce.string().min(1),
        isComplete: z.coerce.boolean(),
        hubId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
        userId: true,
    })
    .superRefine((data, ctx) => {
        // Check if start date is after end date
        if (data.startDate > data.endDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Start date cannot be after end date",
                path: ["startDate"],
            })
        }

        // Check if end date is before start date
        if (data.endDate < data.startDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "End date cannot be before start date",
                path: ["endDate"],
            })
        }

        // Optional: Check if dates are in the past
        const now = new Date()
        if (data.startDate < now) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Start date cannot be in the past",
                path: ["startDate"],
            })
        }
    })

export const updateEventSchema = baseSchema
export const updateEventParams = baseSchema
    .extend({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        completionDate: z.coerce.string().min(1),
        isComplete: z.coerce.boolean(),
        hubId: z.coerce.string().min(1),
    })
    .omit({
        userId: true,
    })
export const eventIdSchema = baseSchema.pick({ id: true })

// Types for events - used to type API request params and within Components
export type Event = typeof hubEvents.$inferSelect
export type NewEvent = z.infer<typeof insertEventSchema>
export type NewEventParams = z.infer<typeof insertEventParams>
export type UpdateEventParams = z.infer<typeof updateEventParams>
export type EventId = z.infer<typeof eventIdSchema>["id"]

// this type infers the return from getEvents() - meaning it will include any joins
export type CompleteEvent = Awaited<
    ReturnType<typeof getEvents>
>["events"][number]

// Many to many relations with users

export const usersJoinedEventsRelations = relations(users, ({ many }) => ({
    usersToEvents: many(usersToEvents),
}))

export const eventsRelations = relations(hubEvents, ({ many }) => ({
    usersToEvents: many(usersToEvents),
}))

export const usersToEvents = pgTable(
    "users_to_events",
    {
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        eventId: varchar("event_id", { length: 256 })
            .notNull()
            .references(() => hubEvents.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at")
            .notNull()
            .default(sql`now()`),
        updatedAt: timestamp("updated_at")
            .notNull()
            .default(sql`now()`),
        invite_status: inviteStatusEnum("pending"),
        invite_role_type: inviteRoleType("member"),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.userId, t.eventId] }),
    }),
)

export const usersToEventsRelations = relations(usersToEvents, ({ one }) => ({
    user: one(users, {
        fields: [usersToEvents.userId],
        references: [users.id],
    }),
    event: one(hubEvents, {
        fields: [usersToEvents.eventId],
        references: [hubEvents.id],
    }),
}))

export const usersToEventsSchema = createSelectSchema(usersToEvents)
    .omit(timestamps)
    .extend({
        invite_status: z.enum(["pending", "accepted", "rejected"]),
        invite_role_type: z.enum(["admin", "member"]),
    })

export const insertUsersToEventsSchema = createInsertSchema(usersToEvents)
    .omit(timestamps)
    .extend({
        invite_status: z.enum(["pending", "accepted", "rejected"]),
        invite_role_type: z.enum(["admin", "member"]),
    })

export const updateUsersToEventsSchema = usersToEventsSchema
export const updateUsersToEventsParams = usersToEventsSchema
    .extend({
        invite_status: z.enum(["pending", "accepted", "rejected"]),
        invite_role_type: z.enum(["admin", "member"]),
    })
    .omit({
        userId: true,
        eventId: true,
    })

export const usersToEventsIdSchema = usersToEventsSchema.pick({
    userId: true,
    eventId: true,
})

export type UsersToEvents = typeof usersToEvents.$inferSelect
export type NewUsersToEvents = z.infer<typeof insertUsersToEventsSchema>
export type UpdateUsersToEventsParams = z.infer<
    typeof updateUsersToEventsParams
>
export type UsersToEventsId = z.infer<typeof usersToEventsIdSchema>
export type UsersToEventsInviteStatus = z.infer<
    typeof usersToEventsSchema
>["invite_status"]
export type UsersToEventsInviteRoleType = z.infer<
    typeof usersToEventsSchema
>["invite_role_type"]
export type UsersToEventsInviteStatusEnum = typeof inviteStatusEnum
export type UsersToEventsInviteRoleTypeEnum = typeof inviteRoleType
