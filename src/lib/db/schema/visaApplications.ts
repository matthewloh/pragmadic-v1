import { sql } from "drizzle-orm"
import { varchar, date, timestamp, boolean, pgTable } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { regions } from "./regions"
import { type getVisaApplications } from "@/lib/api/visaApplications/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const visaApplications = pgTable("visa_applications", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    status: varchar("status", { length: 256 }).notNull(),
    approvedAt: date("approved_at").notNull(),
    expiry: timestamp("expiry", { mode: "date" }),
    applicationType: varchar("application_type", { length: 256 }).notNull(),
    isRenewal: boolean("is_renewal"),
    applicationDate: date("application_date").notNull(),
    healthClearanceStatus: boolean("health_clearance_status"),
    financialProofStatus: varchar("financial_proof_status", { length: 256 }),
    workContractStatus: boolean("work_contract_status"),
    regionId: varchar("region_id", { length: 256 })
        .references(() => regions.id, { onDelete: "cascade" })
        .notNull(),
    userId: varchar("user_id", { length: 256 }).notNull(),

    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
})

// Schema for visaApplications - used to validate API requests
const baseSchema = createSelectSchema(visaApplications).omit(timestamps)

export const insertVisaApplicationSchema =
    createInsertSchema(visaApplications).omit(timestamps)
export const insertVisaApplicationParams = baseSchema
    .extend({
        approvedAt: z.coerce.string().min(1),
        expiry: z.coerce.date(),
        isRenewal: z.coerce.boolean(),
        applicationDate: z.coerce.string().min(1),
        healthClearanceStatus: z.coerce.boolean(),
        workContractStatus: z.coerce.boolean(),
        regionId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
        userId: true,
    })

export const updateVisaApplicationSchema = baseSchema
export const updateVisaApplicationParams = baseSchema
    .extend({
        approvedAt: z.coerce.string().min(1),
        expiry: z.coerce.date(),
        isRenewal: z.coerce.boolean(),
        applicationDate: z.coerce.string().min(1),
        healthClearanceStatus: z.coerce.boolean(),
        workContractStatus: z.coerce.boolean(),
        regionId: z.coerce.string().min(1),
    })
    .omit({
        userId: true,
    })
export const visaApplicationIdSchema = baseSchema.pick({ id: true })

// Types for visaApplications - used to type API request params and within Components
export type VisaApplication = typeof visaApplications.$inferSelect
export type NewVisaApplication = z.infer<typeof insertVisaApplicationSchema>
export type NewVisaApplicationParams = z.infer<
    typeof insertVisaApplicationParams
>
export type UpdateVisaApplicationParams = z.infer<
    typeof updateVisaApplicationParams
>
export type VisaApplicationId = z.infer<typeof visaApplicationIdSchema>["id"]

// this type infers the return from getVisaApplications() - meaning it will include any joins
export type CompleteVisaApplication = Awaited<
    ReturnType<typeof getVisaApplications>
>["visaApplications"][number]
