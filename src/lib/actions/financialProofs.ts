"use server"

import { revalidatePath } from "next/cache"
import {
    createFinancialProof,
    deleteFinancialProof,
    updateFinancialProof,
} from "@/lib/api/financialProofs/mutations"
import {
    FinancialProofId,
    NewFinancialProofParams,
    UpdateFinancialProofParams,
    financialProofIdSchema,
    insertFinancialProofParams,
    updateFinancialProofParams,
} from "@/lib/db/schema/financialProofs"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateFinancialProofs = () => revalidatePath("/financial-proofs")

export const createFinancialProofAction = async (
    input: NewFinancialProofParams,
) => {
    try {
        const payload = insertFinancialProofParams.parse(input)
        await createFinancialProof(payload)
        revalidateFinancialProofs()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateFinancialProofAction = async (
    input: UpdateFinancialProofParams,
) => {
    try {
        const payload = updateFinancialProofParams.parse(input)
        await updateFinancialProof(payload.id, payload)
        revalidateFinancialProofs()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteFinancialProofAction = async (input: FinancialProofId) => {
    try {
        const payload = financialProofIdSchema.parse({ id: input })
        await deleteFinancialProof(payload.id)
        revalidateFinancialProofs()
    } catch (e) {
        return handleErrors(e)
    }
}
