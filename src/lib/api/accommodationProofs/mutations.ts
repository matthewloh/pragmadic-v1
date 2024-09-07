import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import {
    AccommodationProofId,
    NewAccommodationProofParams,
    UpdateAccommodationProofParams,
    updateAccommodationProofSchema,
    insertAccommodationProofSchema,
    accommodationProofs,
    accommodationProofIdSchema,
} from "@/lib/db/schema/accommodationProofs"

export const createAccommodationProof = async (
    accommodationProof: NewAccommodationProofParams,
) => {
    const newAccommodationProof =
        insertAccommodationProofSchema.parse(accommodationProof)
    try {
        const [a] = await db
            .insert(accommodationProofs)
            .values(newAccommodationProof)
            .returning()
        return { accommodationProof: a }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateAccommodationProof = async (
    id: AccommodationProofId,
    accommodationProof: UpdateAccommodationProofParams,
) => {
    const { id: accommodationProofId } = accommodationProofIdSchema.parse({
        id,
    })
    const newAccommodationProof =
        updateAccommodationProofSchema.parse(accommodationProof)
    try {
        const [a] = await db
            .update(accommodationProofs)
            .set({ ...newAccommodationProof, updatedAt: new Date() })
            .where(eq(accommodationProofs.id, accommodationProofId!))
            .returning()
        return { accommodationProof: a }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteAccommodationProof = async (id: AccommodationProofId) => {
    const { id: accommodationProofId } = accommodationProofIdSchema.parse({
        id,
    })
    try {
        const [a] = await db
            .delete(accommodationProofs)
            .where(eq(accommodationProofs.id, accommodationProofId!))
            .returning()
        return { accommodationProof: a }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
