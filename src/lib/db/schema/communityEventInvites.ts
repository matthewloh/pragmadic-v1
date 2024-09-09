import { sql } from "drizzle-orm"
import { varchar, timestamp, text, pgTable, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { communityEvents } from "./communityEvents"
import { userTable } from "@/lib/db/schema/auth-users"
import { type getCommunityEventInvites } from "@/lib/api/communityEventInvites/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const communityEventInvites = pgTable("community_event_invites", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    inviteStatus: varchar("invite_status", { length: 256 }).notNull(),
    acceptedAt: timestamp("accepted_at", { mode: "date" }),
    remarks: text("remarks"),
    communityEventId: varchar("community_event_id", { length: 256 })
        .references(() => communityEvents.id, { onDelete: "cascade" })
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

// Schema for communityEventInvites - used to validate API requests
const baseSchema = createSelectSchema(communityEventInvites).omit(timestamps)

export const insertCommunityEventInviteSchema = createInsertSchema(
    communityEventInvites,
).omit(timestamps)
export const insertCommunityEventInviteParams = baseSchema
    .extend({
        acceptedAt: z.coerce.date(),
        communityEventId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
        userId: true,
    })

export const updateCommunityEventInviteSchema = baseSchema
export const updateCommunityEventInviteParams = baseSchema
    .extend({
        acceptedAt: z.coerce.date(),
        communityEventId: z.coerce.string().min(1),
    })
    .omit({
        userId: true,
    })
export const communityEventInviteIdSchema = baseSchema.pick({ id: true })

// Types for communityEventInvites - used to type API request params and within Components
export type CommunityEventInvite = typeof communityEventInvites.$inferSelect
export type NewCommunityEventInvite = z.infer<
    typeof insertCommunityEventInviteSchema
>
export type NewCommunityEventInviteParams = z.infer<
    typeof insertCommunityEventInviteParams
>
export type UpdateCommunityEventInviteParams = z.infer<
    typeof updateCommunityEventInviteParams
>
export type CommunityEventInviteId = z.infer<
    typeof communityEventInviteIdSchema
>["id"]

// this type infers the return from getCommunityEventInvites() - meaning it will include any joins
export type CompleteCommunityEventInvite = Awaited<
    ReturnType<typeof getCommunityEventInvites>
>["communityEventInvites"][number]
