import { relations, sql } from "drizzle-orm"
import {
    varchar,
    text,
    boolean,
    timestamp,
    pgTable,
    uuid,
    pgEnum,
    primaryKey,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { users } from "@/lib/db/schema/users"
import { type getCommunities } from "@/lib/api/communities/queries"

import { nanoid, timestamps } from "@/lib/utils"
import { inviteRoleType, inviteStatusEnum } from "../shared-enums/invites"

export const communities = pgTable("communities", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description").notNull(),
    rules: text("rules").notNull(),
    isPublic: boolean("is_public").notNull(),
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

// Schema for communities - used to validate API requests
const baseSchema = createSelectSchema(communities).omit(timestamps)

export const insertCommunitySchema =
    createInsertSchema(communities).omit(timestamps)
export const insertCommunityParams = baseSchema
    .extend({
        isPublic: z.coerce.boolean(),
    })
    .omit({
        id: true,
        userId: true,
    })

export const updateCommunitySchema = baseSchema
export const updateCommunityParams = baseSchema
    .extend({
        isPublic: z.coerce.boolean(),
    })
    .omit({
        userId: true,
    })
export const communityIdSchema = baseSchema.pick({ id: true })

// Types for communities - used to type API request params and within Components
export type Community = typeof communities.$inferSelect
export type NewCommunity = z.infer<typeof insertCommunitySchema>
export type NewCommunityParams = z.infer<typeof insertCommunityParams>
export type UpdateCommunityParams = z.infer<typeof updateCommunityParams>
export type CommunityId = z.infer<typeof communityIdSchema>["id"]

// this type infers the return from getCommunities() - meaning it will include any joins
export type CompleteCommunity = Awaited<
    ReturnType<typeof getCommunities>
>["communities"][number]

// Many to many relations with user

export const usersCommunitiesJoinedRelations = relations(users, ({ many }) => ({
    usersToCommunities: many(usersToCommunities),
}))

export const communitiesRelations = relations(communities, ({ many }) => ({
    usersToCommunities: many(usersToCommunities),
}))

export const usersToCommunities = pgTable(
    "users_to_communities",
    {
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        communityId: varchar("community_id", { length: 191 })
            .notNull()
            .references(() => communities.id, { onDelete: "cascade" }),
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
        pk: primaryKey({ columns: [t.userId, t.communityId] }),
    }),
)

export const usersToCommunitiesRelations = relations(
    usersToCommunities,
    ({ one }) => ({
        community: one(communities, {
            fields: [usersToCommunities.communityId],
            references: [communities.id],
        }),
        user: one(users, {
            fields: [usersToCommunities.userId],
            references: [users.id],
        }),
    }),
)

export const usersToCommunitiesSchema = createSelectSchema(usersToCommunities)
    .omit(timestamps)
    .extend({
        invite_status: z.enum(["pending", "accepted", "rejected"]),
        invite_role_type: z.enum(["admin", "member"]),
    })

export const insertUsersToCommunitySchema =
    createInsertSchema(usersToCommunities).omit(timestamps)

export const insertUsersToCommunityParams = usersToCommunitiesSchema
    .extend({
        invite_status: z.enum(["pending", "accepted", "rejected"]),
        invite_role_type: z.enum(["admin", "member"]),
    })
    .omit({
        userId: true,
        communityId: true,
    })

export const updateUsersToCommunitySchema = usersToCommunitiesSchema
export const updateUsersToCommunityParams = usersToCommunitiesSchema
    .extend({
        invite_status: z.enum(["pending", "accepted", "rejected"]),
        invite_role_type: z.enum(["admin", "member"]),
    })
    .omit({
        userId: true,
        communityId: true,
    })

export const usersToCommunityIdSchema = usersToCommunitiesSchema.pick({
    userId: true,
    communityId: true,
})

export type UsersToCommunity = typeof usersToCommunities.$inferSelect
export type NewUsersToCommunity = z.infer<typeof insertUsersToCommunitySchema>
export type NewUsersToCommunityParams = z.infer<
    typeof insertUsersToCommunityParams
>
export type UpdateUsersToCommunityParams = z.infer<
    typeof updateUsersToCommunityParams
>
export type UsersToCommunityId = z.infer<typeof usersToCommunityIdSchema>
export type UsersToCommunityInviteStatus = z.infer<
    typeof usersToCommunitiesSchema
>["invite_status"]
export type UsersToCommunityInviteRoleType = z.infer<
    typeof usersToCommunitiesSchema
>["invite_role_type"]
export type UsersToCommunityInviteStatusEnum = typeof inviteStatusEnum
export type UsersToCommunityInviteRoleTypeEnum = typeof inviteRoleType

export type CommunityWithMembers = {
    community: {
        id: string
        name: string
        description: string
        rules: string
        isPublic: boolean
        createdAt: Date
        userId: string
        updatedAt: Date
    }
    membershipInfo: {
        userId: string
        inviteStatus: "pending" | "accepted" | "rejected" | null
        inviteRoleType: "admin" | "member" | null
    } | null
    user: {
        id: string
        email: string
        displayName: string
        imageUrl: string
    } | null
}
