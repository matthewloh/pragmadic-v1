import { sql } from "drizzle-orm"
import { varchar, date, text, timestamp, pgTable } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { visaApplications } from "./visaApplications"
import { getHealthClearanceInfos } from "@/lib/api/healthClearanceInfo/queries"

import { nanoid, timestamps } from "@/lib/utils"

export const healthClearanceInfo = pgTable("health_clearance_info", {
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    status: varchar("status", { length: 256 }).notNull(),
    clearanceDate: date("clearance_date").notNull(),
    healthFacilityName: varchar("health_facility_name", {
        length: 256,
    }).notNull(),
    medicalReport: text("medical_report").notNull(),
    healthConditions: text("health_conditions").notNull(),
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

// Schema for healthClearanceInfo - used to validate API requests
const baseSchema = createSelectSchema(healthClearanceInfo).omit(timestamps)

export const insertHealthClearanceInfoSchema =
    createInsertSchema(healthClearanceInfo).omit(timestamps)
export const insertHealthClearanceInfoParams = baseSchema
    .extend({
        clearanceDate: z.coerce.string().min(1),
        visaApplicationId: z.coerce.string().min(1),
    })
    .omit({
        id: true,
    })

export const updateHealthClearanceInfoSchema = baseSchema
export const updateHealthClearanceInfoParams = baseSchema.extend({
    clearanceDate: z.coerce.string().min(1),
    visaApplicationId: z.coerce.string().min(1),
})
export const healthClearanceInfoIdSchema = baseSchema.pick({ id: true })

// Types for healthClearanceInfo - used to type API request params and within Components
export type HealthClearanceInfo = typeof healthClearanceInfo.$inferSelect
export type NewHealthClearanceInfo = z.infer<
    typeof insertHealthClearanceInfoSchema
>
export type NewHealthClearanceInfoParams = z.infer<
    typeof insertHealthClearanceInfoParams
>
export type UpdateHealthClearanceInfoParams = z.infer<
    typeof updateHealthClearanceInfoParams
>
export type HealthClearanceInfoId = z.infer<
    typeof healthClearanceInfoIdSchema
>["id"]

// this type infers the return from getHealthClearanceInfo() - meaning it will include any joins
export type CompleteHealthClearanceInfo = Awaited<
    ReturnType<typeof getHealthClearanceInfos>
>["healthClearanceInfo"][number]
