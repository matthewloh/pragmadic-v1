import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import {
    FinancialProofId,
    NewFinancialProofParams,
    UpdateFinancialProofParams,
    updateFinancialProofSchema,
    insertFinancialProofSchema,
    financialProofs,
    financialProofIdSchema,
} from "@/lib/db/schema/financialProofs"

export const createFinancialProof = async (
    financialProof: NewFinancialProofParams,
) => {
    const newFinancialProof = insertFinancialProofSchema.parse(financialProof)
    try {
        const [f] = await db
            .insert(financialProofs)
            .values(newFinancialProof)
            .returning()
        return { financialProof: f }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateFinancialProof = async (
    id: FinancialProofId,
    financialProof: UpdateFinancialProofParams,
) => {
    const { id: financialProofId } = financialProofIdSchema.parse({ id })
    const newFinancialProof = updateFinancialProofSchema.parse(financialProof)
    try {
        const [f] = await db
            .update(financialProofs)
            .set({ ...newFinancialProof, updatedAt: new Date() })
            .where(eq(financialProofs.id, financialProofId!))
            .returning()
        return { financialProof: f }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteFinancialProof = async (id: FinancialProofId) => {
    const { id: financialProofId } = financialProofIdSchema.parse({ id })
    try {
        const [f] = await db
            .delete(financialProofs)
            .where(eq(financialProofs.id, financialProofId!))
            .returning()
        return { financialProof: f }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
