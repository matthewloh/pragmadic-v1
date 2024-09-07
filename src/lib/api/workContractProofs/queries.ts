import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import {
    type WorkContractProofId,
    workContractProofIdSchema,
    workContractProofs,
} from "@/lib/db/schema/workContractProofs"
import { visaApplications } from "@/lib/db/schema/visaApplications"

export const getWorkContractProofs = async () => {
    const rows = await db
        .select({
            workContractProof: workContractProofs,
            visaApplication: visaApplications,
        })
        .from(workContractProofs)
        .leftJoin(
            visaApplications,
            eq(workContractProofs.visaApplicationId, visaApplications.id),
        )
    const w = rows.map((r) => ({
        ...r.workContractProof,
        visaApplication: r.visaApplication,
    }))
    return { workContractProofs: w }
}

export const getWorkContractProofById = async (id: WorkContractProofId) => {
    const { id: workContractProofId } = workContractProofIdSchema.parse({ id })
    const [row] = await db
        .select({
            workContractProof: workContractProofs,
            visaApplication: visaApplications,
        })
        .from(workContractProofs)
        .where(eq(workContractProofs.id, workContractProofId))
        .leftJoin(
            visaApplications,
            eq(workContractProofs.visaApplicationId, visaApplications.id),
        )
    if (row === undefined) return {}
    const w = { ...row.workContractProof, visaApplication: row.visaApplication }
    return { workContractProof: w }
}
