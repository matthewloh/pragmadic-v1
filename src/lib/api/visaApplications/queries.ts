import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { checkAuth } from "@/lib/auth/utils"
import {
    type VisaApplicationId,
    visaApplicationIdSchema,
    visaApplications,
} from "@/lib/db/schema/visaApplications"
import { regions } from "@/lib/db/schema/regions"
import {
    healthClearanceInfo,
    type CompleteHealthClearanceInfo,
} from "@/lib/db/schema/healthClearanceInfo"
import {
    financialProofs,
    type CompleteFinancialProof,
} from "@/lib/db/schema/financialProofs"
import {
    accommodationProofs,
    type CompleteAccommodationProof,
} from "@/lib/db/schema/accommodationProofs"
import {
    workContractProofs,
    type CompleteWorkContractProof,
} from "@/lib/db/schema/workContractProofs"

export const getVisaApplications = async () => {
    const { session } = await checkAuth()
    const rows = await db
        .select({ visaApplication: visaApplications, region: regions })
        .from(visaApplications)
        .leftJoin(regions, eq(visaApplications.regionId, regions.id))
        .where(eq(visaApplications.userId, session?.user.id!))
    const v = rows.map((r) => ({ ...r.visaApplication, region: r.region }))
    return { visaApplications: v }
}

export const getVisaApplicationById = async (id: VisaApplicationId) => {
    const { session } = await checkAuth()
    const { id: visaApplicationId } = visaApplicationIdSchema.parse({ id })
    const [row] = await db
        .select({ visaApplication: visaApplications, region: regions })
        .from(visaApplications)
        .where(
            and(
                eq(visaApplications.id, visaApplicationId),
                eq(visaApplications.userId, session?.user.id!),
            ),
        )
        .leftJoin(regions, eq(visaApplications.regionId, regions.id))
    if (row === undefined) return {}
    const v = { ...row.visaApplication, region: row.region }
    return { visaApplication: v }
}

export const getVisaApplicationByIdWithHealthClearanceInfoAndFinancialProofsAndAccommodationProofsAndWorkContractProofs =
    async (id: VisaApplicationId) => {
        const { session } = await checkAuth()
        const { id: visaApplicationId } = visaApplicationIdSchema.parse({ id })
        const rows = await db
            .select({
                visaApplication: visaApplications,
                healthClearanceInfo: healthClearanceInfo,
                financialProof: financialProofs,
                accommodationProof: accommodationProofs,
                workContractProof: workContractProofs,
            })
            .from(visaApplications)
            .where(
                and(
                    eq(visaApplications.id, visaApplicationId),
                    eq(visaApplications.userId, session?.user.id!),
                ),
            )
            .leftJoin(
                healthClearanceInfo,
                eq(visaApplications.id, healthClearanceInfo.visaApplicationId),
            )
            .leftJoin(
                financialProofs,
                eq(visaApplications.id, financialProofs.visaApplicationId),
            )
            .leftJoin(
                accommodationProofs,
                eq(visaApplications.id, accommodationProofs.visaApplicationId),
            )
            .leftJoin(
                workContractProofs,
                eq(visaApplications.id, workContractProofs.visaApplicationId),
            )
        if (rows.length === 0) return {}
        const v = rows[0].visaApplication
        const vh = rows
            .filter((r) => r.healthClearanceInfo !== null)
            .map((h) => h.healthClearanceInfo) as CompleteHealthClearanceInfo[]
        const vf = rows
            .filter((r) => r.financialProof !== null)
            .map((f) => f.financialProof) as CompleteFinancialProof[]
        const va = rows
            .filter((r) => r.accommodationProof !== null)
            .map((a) => a.accommodationProof) as CompleteAccommodationProof[]
        const vw = rows
            .filter((r) => r.workContractProof !== null)
            .map((w) => w.workContractProof) as CompleteWorkContractProof[]

        return {
            visaApplication: v,
            healthClearanceInfo: vh,
            financialProofs: vf,
            accommodationProofs: va,
            workContractProofs: vw,
        }
    }
