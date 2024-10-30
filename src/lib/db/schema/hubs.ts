import { sql, relations } from "drizzle-orm"
import {
    varchar,
    text,
    boolean,
    timestamp,
    pgTable,
    uuid,
    primaryKey,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { nanoid, timestamps } from "@/lib/utils"

import { users } from "@/lib/db/schema/users"
import { states } from "@/lib/db/schema/states"
import { type getHubs } from "@/lib/api/hubs/queries"
import { inviteRoleType, inviteStatusEnum } from "../shared-enums/invites"

export const hubs = pgTable("hubs", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    typeOfHub: varchar("type_of_hub", { length: 256 }).notNull(),
    public: boolean("public").notNull(),
    info: text("info"),
    userId: uuid("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    stateId: varchar("state_id", { length: 256 })
        .references(() => states.id, { onDelete: "cascade" })
        .notNull(),

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
    })
    .omit({
        id: true,
        userId: true,
    })

export const updateHubSchema = baseSchema
export const updateHubParams = baseSchema
    .extend({
        public: z.coerce.boolean(),
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

// Many to many relations with users

export const userHubRelationships = relations(users, ({ many }) => ({
    usersToHubs: many(usersToHubs),
}))

export const hubsRelations = relations(hubs, ({ many }) => ({
    usersToHubs: many(usersToHubs),
}))

export const usersToHubs = pgTable(
    "users_to_hubs",
    {
        user_id: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        hub_id: varchar("hub_id", { length: 191 })
            .notNull()
            .references(() => hubs.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at")
            .notNull()
            .default(sql`now()`),
        updatedAt: timestamp("updated_at")
            .notNull()
            .default(sql`now()`),
        invite_status: inviteStatusEnum("invite_status").default("pending"),
        invite_role_type: inviteRoleType("invite_role_type").default("member"),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.user_id, t.hub_id] }),
    }),
)

export const usersToHubsRelations = relations(usersToHubs, ({ one }) => ({
    hub: one(hubs, {
        fields: [usersToHubs.hub_id],
        references: [hubs.id],
    }),
    user: one(users, {
        fields: [usersToHubs.user_id],
        references: [users.id],
    }),
}))

export const usersToHubsSchema = createSelectSchema(usersToHubs)
    .omit(timestamps)
    .extend({
        invite_status: z.enum(["pending", "accepted", "rejected"]),
        invite_role_type: z.enum(["admin", "member"]),
    })

export const insertUsersToHubSchema =
    createInsertSchema(usersToHubs).omit(timestamps)

export const insertUsersToHubParams = usersToHubsSchema
    .extend({
        invite_status: z.enum(["pending", "accepted", "rejected"]),
        invite_role_type: z.enum(["admin", "member"]),
    })
    .omit({
        user_id: true,
        hub_id: true,
    })

export const updateUsersToHubSchema = usersToHubsSchema
export const updateUsersToHubParams = usersToHubsSchema
    .extend({
        invite_status: z.enum(["pending", "accepted", "rejected"]),
        invite_role_type: z.enum(["admin", "member"]),
    })
    .omit({
        user_id: true,
        hub_id: true,
    })

export const usersToHubIdSchema = usersToHubsSchema.pick({
    user_id: true,
    hub_id: true,
})

export type UsersToHub = typeof usersToHubs.$inferSelect
export type NewUsersToHub = z.infer<typeof insertUsersToHubSchema>
export type NewUsersToHubParams = z.infer<typeof insertUsersToHubParams>
export type UpdateUsersToHubParams = z.infer<typeof updateUsersToHubParams>
export type UsersToHubId = z.infer<typeof usersToHubIdSchema>
export type UsersToHubInviteStatus = z.infer<
    typeof usersToHubsSchema
>["invite_status"]
export type UsersToHubInviteRoleType = z.infer<
    typeof usersToHubsSchema
>["invite_role_type"]
export type UsersToHubInviteStatusEnum = typeof inviteStatusEnum
export type UsersToHubInviteRoleTypeEnum = typeof inviteRoleType

export type HubWithMembers = {
    hub: {
        id: string
        name: string
        description: string | null
        typeOfHub: string
        public: boolean
        info: string | null
        createdAt: Date
        user_id: string
        updatedAt: Date
        stateId: string
    }
    membershipInfo: {
        user_id: string
        invite_status: "pending" | "accepted" | "rejected" | null
        invite_role_type: "admin" | "member" | null
    } | null
    user: {
        id: string
        email: string
        displayName: string
        imageUrl: string | null
    } | null
}
