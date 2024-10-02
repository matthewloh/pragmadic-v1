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
import { communities } from "./communities"
import { users } from "@/lib/db/schema/users"
import { type getCommunityPosts } from "@/lib/api/communityPosts/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const communityPosts = pgTable("community_posts", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    title: varchar("title", { length: 256 }).notNull(),
    content: text("content").notNull(),
    category: varchar("category", { length: 256 }),
    isPublic: boolean("is_public").notNull(),
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

// Schema for communityPosts - used to validate API requests
const baseSchema = createSelectSchema(communityPosts).omit(timestamps)

export const insertCommunityPostSchema =
    createInsertSchema(communityPosts).omit(timestamps)
export const insertCommunityPostParams = baseSchema
    .extend({
        isPublic: z.coerce.boolean(),
        communityId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
        userId: true,
    })

export const updateCommunityPostSchema = baseSchema
export const updateCommunityPostParams = baseSchema
    .extend({
        isPublic: z.coerce.boolean(),
        communityId: z.coerce.string().min(1),
    })
    .omit({
        userId: true,
    })
export const communityPostIdSchema = baseSchema.pick({ id: true })

// Types for communityPosts - used to type API request params and within Components
export type CommunityPost = typeof communityPosts.$inferSelect
export type NewCommunityPost = z.infer<typeof insertCommunityPostSchema>
export type NewCommunityPostParams = z.infer<typeof insertCommunityPostParams>
export type UpdateCommunityPostParams = z.infer<
    typeof updateCommunityPostParams
>
export type CommunityPostId = z.infer<typeof communityPostIdSchema>["id"]

// this type infers the return from getCommunityPosts() - meaning it will include any joins
export type CompleteCommunityPost = Awaited<
    ReturnType<typeof getCommunityPosts>
>["communityPosts"][number]
