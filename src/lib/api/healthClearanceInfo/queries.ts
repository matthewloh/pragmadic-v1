import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import {
    type HealthClearanceInfoId,
    healthClearanceInfoIdSchema,
    healthClearanceInfo,
} from "@/lib/db/schema/healthClearanceInfo"
import { visaApplications } from "@/lib/db/schema/visaApplications"

export const getHealthClearanceInfos = async () => {
    const rows = await db
        .select({
            healthClearanceInfo: healthClearanceInfo,
            visaApplication: visaApplications,
        })
        .from(healthClearanceInfo)
        .leftJoin(
            visaApplications,
            eq(healthClearanceInfo.visaApplicationId, visaApplications.id),
        )
    const h = rows.map((r) => ({
        ...r.healthClearanceInfo,
        visaApplication: r.visaApplication,
    }))
    return { healthClearanceInfo: h }
}

export const getHealthClearanceInfoById = async (id: HealthClearanceInfoId) => {
    const { id: healthClearanceInfoId } = healthClearanceInfoIdSchema.parse({
        id,
    })
    const [row] = await db
        .select({
            healthClearanceInfo: healthClearanceInfo,
            visaApplication: visaApplications,
        })
        .from(healthClearanceInfo)
        .where(eq(healthClearanceInfo.id, healthClearanceInfoId))
        .leftJoin(
            visaApplications,
            eq(healthClearanceInfo.visaApplicationId, visaApplications.id),
        )
    if (row === undefined) return {}
    const h = {
        ...row.healthClearanceInfo,
        visaApplication: row.visaApplication,
    }
    return { healthClearanceInfo: h }
}
