import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import {
    WorkContractProofId,
    NewWorkContractProofParams,
    UpdateWorkContractProofParams,
    updateWorkContractProofSchema,
    insertWorkContractProofSchema,
    workContractProofs,
    workContractProofIdSchema,
} from "@/lib/db/schema/workContractProofs"

export const createWorkContractProof = async (
    workContractProof: NewWorkContractProofParams,
) => {
    const newWorkContractProof =
        insertWorkContractProofSchema.parse(workContractProof)
    try {
        const [w] = await db
            .insert(workContractProofs)
            .values(newWorkContractProof)
            .returning()
        return { workContractProof: w }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateWorkContractProof = async (
    id: WorkContractProofId,
    workContractProof: UpdateWorkContractProofParams,
) => {
    const { id: workContractProofId } = workContractProofIdSchema.parse({ id })
    const newWorkContractProof =
        updateWorkContractProofSchema.parse(workContractProof)
    try {
        const [w] = await db
            .update(workContractProofs)
            .set({ ...newWorkContractProof, updatedAt: new Date() })
            .where(eq(workContractProofs.id, workContractProofId!))
            .returning()
        return { workContractProof: w }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteWorkContractProof = async (id: WorkContractProofId) => {
    const { id: workContractProofId } = workContractProofIdSchema.parse({ id })
    try {
        const [w] = await db
            .delete(workContractProofs)
            .where(eq(workContractProofs.id, workContractProofId!))
            .returning()
        return { workContractProof: w }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
