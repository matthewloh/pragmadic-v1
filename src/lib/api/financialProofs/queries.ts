import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import {
    type FinancialProofId,
    financialProofIdSchema,
    financialProofs,
} from "@/lib/db/schema/financialProofs"
import { visaApplications } from "@/lib/db/schema/visaApplications"

export const getFinancialProofs = async () => {
    const rows = await db
        .select({
            financialProof: financialProofs,
            visaApplication: visaApplications,
        })
        .from(financialProofs)
        .leftJoin(
            visaApplications,
            eq(financialProofs.visaApplicationId, visaApplications.id),
        )
    const f = rows.map((r) => ({
        ...r.financialProof,
        visaApplication: r.visaApplication,
    }))
    return { financialProofs: f }
}

export const getFinancialProofById = async (id: FinancialProofId) => {
    const { id: financialProofId } = financialProofIdSchema.parse({ id })
    const [row] = await db
        .select({
            financialProof: financialProofs,
            visaApplication: visaApplications,
        })
        .from(financialProofs)
        .where(eq(financialProofs.id, financialProofId))
        .leftJoin(
            visaApplications,
            eq(financialProofs.visaApplicationId, visaApplications.id),
        )
    if (row === undefined) return {}
    const f = { ...row.financialProof, visaApplication: row.visaApplication }
    return { financialProof: f }
}
