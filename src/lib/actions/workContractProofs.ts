"use server"

import { revalidatePath } from "next/cache"
import {
    createWorkContractProof,
    deleteWorkContractProof,
    updateWorkContractProof,
} from "@/lib/api/workContractProofs/mutations"
import {
    WorkContractProofId,
    NewWorkContractProofParams,
    UpdateWorkContractProofParams,
    workContractProofIdSchema,
    insertWorkContractProofParams,
    updateWorkContractProofParams,
} from "@/lib/db/schema/workContractProofs"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateWorkContractProofs = () =>
    revalidatePath("/work-contract-proofs")

export const createWorkContractProofAction = async (
    input: NewWorkContractProofParams,
) => {
    try {
        const payload = insertWorkContractProofParams.parse(input)
        await createWorkContractProof(payload)
        revalidateWorkContractProofs()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateWorkContractProofAction = async (
    input: UpdateWorkContractProofParams,
) => {
    try {
        const payload = updateWorkContractProofParams.parse(input)
        await updateWorkContractProof(payload.id, payload)
        revalidateWorkContractProofs()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteWorkContractProofAction = async (
    input: WorkContractProofId,
) => {
    try {
        const payload = workContractProofIdSchema.parse({ id: input })
        await deleteWorkContractProof(payload.id)
        revalidateWorkContractProofs()
    } catch (e) {
        return handleErrors(e)
    }
}
