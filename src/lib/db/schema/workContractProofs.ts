import { sql } from "drizzle-orm"
import { varchar, date, text, timestamp, pgTable } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { visaApplications } from "./visaApplications"
import { type getWorkContractProofs } from "@/lib/api/workContractProofs/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const workContractProofs = pgTable("work_contract_proofs", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    status: varchar("status", { length: 256 }).notNull(),
    submissionDate: date("submission_date").notNull(),
    documentLinks: text("document_links"),
    employerDetails: text("employer_details"),
    contractDetails: text("contract_details"),
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

// Schema for workContractProofs - used to validate API requests
const baseSchema = createSelectSchema(workContractProofs).omit(timestamps)

export const insertWorkContractProofSchema =
    createInsertSchema(workContractProofs).omit(timestamps)
export const insertWorkContractProofParams = baseSchema
    .extend({
        submissionDate: z.coerce.string().min(1),
        visaApplicationId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
    })

export const updateWorkContractProofSchema = baseSchema
export const updateWorkContractProofParams = baseSchema.extend({
    submissionDate: z.coerce.string().min(1),
    visaApplicationId: z.coerce.string().min(1),
})
export const workContractProofIdSchema = baseSchema.pick({ id: true })

// Types for workContractProofs - used to type API request params and within Components
export type WorkContractProof = typeof workContractProofs.$inferSelect
export type NewWorkContractProof = z.infer<typeof insertWorkContractProofSchema>
export type NewWorkContractProofParams = z.infer<
    typeof insertWorkContractProofParams
>
export type UpdateWorkContractProofParams = z.infer<
    typeof updateWorkContractProofParams
>
export type WorkContractProofId = z.infer<
    typeof workContractProofIdSchema
>["id"]

// this type infers the return from getWorkContractProofs() - meaning it will include any joins
export type CompleteWorkContractProof = Awaited<
    ReturnType<typeof getWorkContractProofs>
>["workContractProofs"][number]
