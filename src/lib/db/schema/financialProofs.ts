import { sql } from "drizzle-orm"
import {
    varchar,
    date,
    text,
    integer,
    boolean,
    timestamp,
    pgTable,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { visaApplications } from "./visaApplications"
import { type getFinancialProofs } from "@/lib/api/financialProofs/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const financialProofs = pgTable("financial_proofs", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    status: varchar("status", { length: 256 }).notNull(),
    submissionDate: date("submission_date").notNull(),
    documentLinks: text("document_links"),
    declaredAmount: integer("declared_amount").notNull(),
    verificationStatus: boolean("verification_status").notNull(),
    remarks: text("remarks").notNull(),
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

// Schema for financialProofs - used to validate API requests
const baseSchema = createSelectSchema(financialProofs).omit(timestamps)

export const insertFinancialProofSchema =
    createInsertSchema(financialProofs).omit(timestamps)
export const insertFinancialProofParams = baseSchema
    .extend({
        submissionDate: z.coerce.string().min(1),
        declaredAmount: z.coerce.number(),
        verificationStatus: z.coerce.boolean(),
        visaApplicationId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
    })

export const updateFinancialProofSchema = baseSchema
export const updateFinancialProofParams = baseSchema.extend({
    submissionDate: z.coerce.string().min(1),
    declaredAmount: z.coerce.number(),
    verificationStatus: z.coerce.boolean(),
    visaApplicationId: z.coerce.string().min(1),
})
export const financialProofIdSchema = baseSchema.pick({ id: true })

// Types for financialProofs - used to type API request params and within Components
export type FinancialProof = typeof financialProofs.$inferSelect
export type NewFinancialProof = z.infer<typeof insertFinancialProofSchema>
export type NewFinancialProofParams = z.infer<typeof insertFinancialProofParams>
export type UpdateFinancialProofParams = z.infer<
    typeof updateFinancialProofParams
>
export type FinancialProofId = z.infer<typeof financialProofIdSchema>["id"]

// this type infers the return from getFinancialProofs() - meaning it will include any joins
export type CompleteFinancialProof = Awaited<
    ReturnType<typeof getFinancialProofs>
>["financialProofs"][number]
