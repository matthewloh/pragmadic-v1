import { sql } from "drizzle-orm"
import { text, varchar, timestamp, pgTable, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { communityPosts } from "./communityPosts"
import { users } from "@/lib/db/schema/users"
import { type getCommunityPostReplies } from "@/lib/api/communityPostReplies/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const communityPostReplies = pgTable("community_post_replies", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    content: text("content").notNull(),
    communityPostId: varchar("community_post_id", { length: 256 })
        .references(() => communityPosts.id, { onDelete: "cascade" })
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

// Schema for communityPostReplies - used to validate API requests
const baseSchema = createSelectSchema(communityPostReplies).omit(timestamps)

export const insertCommunityPostReplySchema =
    createInsertSchema(communityPostReplies).omit(timestamps)
export const insertCommunityPostReplyParams = baseSchema
    .extend({
        communityPostId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
        userId: true,
    })

export const updateCommunityPostReplySchema = baseSchema
export const updateCommunityPostReplyParams = baseSchema
    .extend({
        communityPostId: z.coerce.string().min(1),
    })
    .omit({
        userId: true,
    })
export const communityPostReplyIdSchema = baseSchema.pick({ id: true })

// Types for communityPostReplies - used to type API request params and within Components
export type CommunityPostReply = typeof communityPostReplies.$inferSelect
export type NewCommunityPostReply = z.infer<
    typeof insertCommunityPostReplySchema
>
export type NewCommunityPostReplyParams = z.infer<
    typeof insertCommunityPostReplyParams
>
export type UpdateCommunityPostReplyParams = z.infer<
    typeof updateCommunityPostReplyParams
>
export type CommunityPostReplyId = z.infer<
    typeof communityPostReplyIdSchema
>["id"]

// this type infers the return from getCommunityPostReplies() - meaning it will include any joins
export type CompleteCommunityPostReply = Awaited<
    ReturnType<typeof getCommunityPostReplies>
>["communityPostReplies"][number]
