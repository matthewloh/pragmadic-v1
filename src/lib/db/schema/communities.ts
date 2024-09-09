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

import { userTable } from "@/lib/db/schema/auth-users"
import { type getCommunities } from "@/lib/api/communities/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const communities = pgTable("communities", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description").notNull(),
    rules: text("rules").notNull(),
    isPublic: boolean("is_public").notNull(),
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
