import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import {
    HealthClearanceInfoId,
    NewHealthClearanceInfoParams,
    UpdateHealthClearanceInfoParams,
    updateHealthClearanceInfoSchema,
    insertHealthClearanceInfoSchema,
    healthClearanceInfo as healthClearanceInfoSchema,
    healthClearanceInfoIdSchema,
} from "@/lib/db/schema/healthClearanceInfo"

export const createHealthClearanceInfo = async (
    healthClearanceInfo: NewHealthClearanceInfoParams,
) => {
    const newHealthClearanceInfo =
        insertHealthClearanceInfoSchema.parse(healthClearanceInfo)
    try {
        const [h] = await db
            .insert(healthClearanceInfoSchema)
            .values(newHealthClearanceInfo)
            .returning()
        return { healthClearanceInfo: h }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateHealthClearanceInfo = async (
    id: HealthClearanceInfoId,
    healthClearanceInfo: UpdateHealthClearanceInfoParams,
) => {
    const { id: healthClearanceInfoId } = healthClearanceInfoIdSchema.parse({
        id,
    })
    const newHealthClearanceInfo =
        updateHealthClearanceInfoSchema.parse(healthClearanceInfo)
    try {
        const [h] = await db
            .update(healthClearanceInfoSchema)
            .set({ ...newHealthClearanceInfo, updatedAt: new Date() })
            .where(eq(healthClearanceInfoSchema.id, healthClearanceInfoId!))
            .returning()
        return { healthClearanceInfo: h }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteHealthClearanceInfo = async (id: HealthClearanceInfoId) => {
    const { id: healthClearanceInfoId } = healthClearanceInfoIdSchema.parse({
        id,
    })
    try {
        const [h] = await db
            .delete(healthClearanceInfoSchema)
            .where(eq(healthClearanceInfoSchema.id, healthClearanceInfoId!))
            .returning()
        return { healthClearanceInfo: h }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
