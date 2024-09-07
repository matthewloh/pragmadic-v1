import { sql } from "drizzle-orm"
import { varchar, date, text, timestamp, pgTable } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { visaApplications } from "./visaApplications"
import { type getAccommodationProofs } from "@/lib/api/accommodationProofs/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const accommodationProofs = pgTable("accommodation_proofs", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    status: varchar("status", { length: 256 }).notNull(),
    submissionDate: date("submission_date").notNull(),
    accommodationDetails: text("accommodation_details"),
    accommodationType: varchar("accommodation_type", { length: 256 }),
    verificationStatus: varchar("verification_status", { length: 256 }),
    remarks: text("remarks"),
    visaApplicationId: varchar("visa_application_id", { length: 256 })
        .references(() => visaApplications.id, { onDelete: "cascade" })
        .notNull(),

    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
})

// Schema for accommodationProofs - used to validate API requests
const baseSchema = createSelectSchema(accommodationProofs).omit(timestamps)

export const insertAccommodationProofSchema =
    createInsertSchema(accommodationProofs).omit(timestamps)
export const insertAccommodationProofParams = baseSchema
    .extend({
        submissionDate: z.coerce.string().min(1),
        visaApplicationId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
    })

export const updateAccommodationProofSchema = baseSchema
export const updateAccommodationProofParams = baseSchema.extend({
    submissionDate: z.coerce.string().min(1),
    visaApplicationId: z.coerce.string().min(1),
})
export const accommodationProofIdSchema = baseSchema.pick({ id: true })

// Types for accommodationProofs - used to type API request params and within Components
export type AccommodationProof = typeof accommodationProofs.$inferSelect
export type NewAccommodationProof = z.infer<
    typeof insertAccommodationProofSchema
>
export type NewAccommodationProofParams = z.infer<
    typeof insertAccommodationProofParams
>
export type UpdateAccommodationProofParams = z.infer<
    typeof updateAccommodationProofParams
>
export type AccommodationProofId = z.infer<
    typeof accommodationProofIdSchema
>["id"]

// this type infers the return from getAccommodationProofs() - meaning it will include any joins
export type CompleteAccommodationProof = Awaited<
    ReturnType<typeof getAccommodationProofs>
>["accommodationProofs"][number]
