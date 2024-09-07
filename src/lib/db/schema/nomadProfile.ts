import { sql } from "drizzle-orm"
import { text, varchar, timestamp, pgTable, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { userTable } from "@/lib/db/schema/auth-users"
import { type getNomadProfiles } from "@/lib/api/nomadProfile/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const nomadProfile = pgTable("nomad_profile", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    bio: text("bio"),
    skills: text("skills"),
    interests: text("interests"),
    currentLocation: varchar("current_location", { length: 256 }),
    contactInformation: text("contact_information"),
    userId: uuid("user_id")
        .defaultRandom()
        .references(() => userTable.id, { onDelete: "cascade" })
        .notNull(),

    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
})

// Schema for nomadProfile - used to validate API requests
const baseSchema = createSelectSchema(nomadProfile).omit(timestamps)

export const insertNomadProfileSchema =
    createInsertSchema(nomadProfile).omit(timestamps)
export const insertNomadProfileParams = baseSchema.extend({}).omit({
    id: true,
    userId: true,
})

export const updateNomadProfileSchema = baseSchema
export const updateNomadProfileParams = baseSchema.extend({}).omit({
    userId: true,
})
export const nomadProfileIdSchema = baseSchema.pick({ id: true })

// Types for nomadProfile - used to type API request params and within Components
export type NomadProfile = typeof nomadProfile.$inferSelect
export type NewNomadProfile = z.infer<typeof insertNomadProfileSchema>
export type NewNomadProfileParams = z.infer<typeof insertNomadProfileParams>
export type UpdateNomadProfileParams = z.infer<typeof updateNomadProfileParams>
export type NomadProfileId = z.infer<typeof nomadProfileIdSchema>["id"]

// this type infers the return from getNomadProfile() - meaning it will include any joins
export type CompleteNomadProfile = Awaited<
    ReturnType<typeof getNomadProfiles>
>["nomadProfile"][number]
