import { sql } from "drizzle-orm"
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { type getHubOwnerProfiles } from "@/lib/api/hubOwnerProfiles/queries"
import { userTable } from "@/lib/db/schema/auth-users"

import { nanoid, timestamps } from "@/lib/utils"

export const hubOwnerProfiles = pgTable("hub_owner_profiles", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    companyName: varchar("company_name", { length: 256 }),
    businessRegistrationNumber: varchar("business_registration_number", {
        length: 256,
    }),
    bio: text("bio").notNull(),
    businessContactNo: varchar("business_contact_no", {
        length: 256,
    }).notNull(),
    businessEmail: varchar("business_email", { length: 256 }).notNull(),
    businessLocation: varchar("business_location", { length: 256 }).notNull(),
    residingLocation: varchar("residing_location", { length: 256 }).notNull(),
    socialMediaHandles: text("social_media_handles"),
    websiteUrl: varchar("website_url", { length: 256 }),
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

// Schema for hubOwnerProfiles - used to validate API requests
const baseSchema = createSelectSchema(hubOwnerProfiles).omit(timestamps)

export const insertHubOwnerProfileSchema =
    createInsertSchema(hubOwnerProfiles).omit(timestamps)
export const insertHubOwnerProfileParams = baseSchema.extend({}).omit({
    id: true,
    userId: true,
})

export const updateHubOwnerProfileSchema = baseSchema
export const updateHubOwnerProfileParams = baseSchema.extend({}).omit({
    userId: true,
})
export const hubOwnerProfileIdSchema = baseSchema.pick({ id: true })

// Types for hubOwnerProfiles - used to type API request params and within Components
export type HubOwnerProfile = typeof hubOwnerProfiles.$inferSelect
export type NewHubOwnerProfile = z.infer<typeof insertHubOwnerProfileSchema>
export type NewHubOwnerProfileParams = z.infer<
    typeof insertHubOwnerProfileParams
>
export type UpdateHubOwnerProfileParams = z.infer<
    typeof updateHubOwnerProfileParams
>
export type HubOwnerProfileId = z.infer<typeof hubOwnerProfileIdSchema>["id"]

// this type infers the return from getHubOwnerProfiles() - meaning it will include any joins
export type CompleteHubOwnerProfile = Awaited<
    ReturnType<typeof getHubOwnerProfiles>
>["hubOwnerProfiles"][number]

