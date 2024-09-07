import { sql } from "drizzle-orm"
import { varchar, text, integer, timestamp, pgTable } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { hubs } from "./hubs"
import { type getReviews } from "@/lib/api/reviews/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const reviews = pgTable("reviews", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    title: varchar("title", { length: 256 }).notNull(),
    content: text("content").notNull(),
    rating: integer("rating").notNull(),
    photoUrl: varchar("photo_url", { length: 256 }),
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

// Schema for reviews - used to validate API requests
const baseSchema = createSelectSchema(reviews).omit(timestamps)

export const insertReviewSchema = createInsertSchema(reviews).omit(timestamps)
export const insertReviewParams = baseSchema
    .extend({
        rating: z.coerce.number(),
        hubId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
        userId: true,
    })

export const updateReviewSchema = baseSchema
export const updateReviewParams = baseSchema
    .extend({
        rating: z.coerce.number(),
        hubId: z.coerce.string().min(1),
    })
    .omit({
        userId: true,
    })
export const reviewIdSchema = baseSchema.pick({ id: true })

// Types for reviews - used to type API request params and within Components
export type Review = typeof reviews.$inferSelect
export type NewReview = z.infer<typeof insertReviewSchema>
export type NewReviewParams = z.infer<typeof insertReviewParams>
export type UpdateReviewParams = z.infer<typeof updateReviewParams>
export type ReviewId = z.infer<typeof reviewIdSchema>["id"]

// this type infers the return from getReviews() - meaning it will include any joins
export type CompleteReview = Awaited<
    ReturnType<typeof getReviews>
>["reviews"][number]
