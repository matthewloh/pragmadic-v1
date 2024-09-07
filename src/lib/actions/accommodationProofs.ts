"use server"

import { revalidatePath } from "next/cache"
import {
    createAccommodationProof,
    deleteAccommodationProof,
    updateAccommodationProof,
} from "@/lib/api/accommodationProofs/mutations"
import {
    AccommodationProofId,
    NewAccommodationProofParams,
    UpdateAccommodationProofParams,
    accommodationProofIdSchema,
    insertAccommodationProofParams,
    updateAccommodationProofParams,
} from "@/lib/db/schema/accommodationProofs"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateAccommodationProofs = () =>
    revalidatePath("/accommodation-proofs")

export const createAccommodationProofAction = async (
    input: NewAccommodationProofParams,
) => {
    try {
        const payload = insertAccommodationProofParams.parse(input)
        await createAccommodationProof(payload)
        revalidateAccommodationProofs()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateAccommodationProofAction = async (
    input: UpdateAccommodationProofParams,
) => {
    try {
        const payload = updateAccommodationProofParams.parse(input)
        await updateAccommodationProof(payload.id, payload)
        revalidateAccommodationProofs()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteAccommodationProofAction = async (
    input: AccommodationProofId,
) => {
    try {
        const payload = accommodationProofIdSchema.parse({ id: input })
        await deleteAccommodationProof(payload.id)
        revalidateAccommodationProofs()
    } catch (e) {
        return handleErrors(e)
    }
}
