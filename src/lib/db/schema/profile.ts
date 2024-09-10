import { relations, sql } from "drizzle-orm"
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { type getProfiles } from "@/lib/api/profile/queries"
import { users } from "@/lib/db/schema/auth-users"

import { nanoid, timestamps } from "@/lib/utils"

export const profile = pgTable("profile", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    bio: text("bio").notNull(),
    occupation: varchar("occupation", { length: 256 }),
    location: varchar("location", { length: 256 }),
    website: varchar("website", { length: 256 }).notNull(),
    contactNumber: varchar("contact_number", { length: 256 }),
    socialLinks: text("social_links"),
    userId: uuid("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull()
        .unique(),
    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
})

// Schema for profile - used to validate API requests
const baseSchema = createSelectSchema(profile).omit(timestamps)

export const insertProfileSchema = createInsertSchema(profile).omit(timestamps)
export const insertProfileParams = baseSchema.extend({}).omit({
    id: true,
    userId: true,
})

export const updateProfileSchema = baseSchema
export const updateProfileParams = baseSchema.extend({}).omit({
    userId: true,
})
export const profileIdSchema = baseSchema.pick({ id: true })

// Types for profile - used to type API request params and within Components
export type Profile = typeof profile.$inferSelect
export type NewProfile = z.infer<typeof insertProfileSchema>
export type NewProfileParams = z.infer<typeof insertProfileParams>
export type UpdateProfileParams = z.infer<typeof updateProfileParams>
export type ProfileId = z.infer<typeof profileIdSchema>["id"]

// this type infers the return from getProfile() - meaning it will include any joins
export type CompleteProfile = Awaited<
    ReturnType<typeof getProfiles>
>["profile"][number]

export const usersRelations = relations(users, ({ one }) => ({
    profile: one(profile, {
        fields: [users.id],
        references: [profile.userId],
    }),
}))

export const profileRelations = relations(profile, ({ one }) => ({
    user: one(users, {
        fields: [profile.userId],
        references: [users.id],
    }),
}))
