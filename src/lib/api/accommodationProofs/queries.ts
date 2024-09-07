import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import {
    type AccommodationProofId,
    accommodationProofIdSchema,
    accommodationProofs,
} from "@/lib/db/schema/accommodationProofs"
import { visaApplications } from "@/lib/db/schema/visaApplications"

export const getAccommodationProofs = async () => {
    const rows = await db
        .select({
            accommodationProof: accommodationProofs,
            visaApplication: visaApplications,
        })
        .from(accommodationProofs)
        .leftJoin(
            visaApplications,
            eq(accommodationProofs.visaApplicationId, visaApplications.id),
        )
    const a = rows.map((r) => ({
        ...r.accommodationProof,
        visaApplication: r.visaApplication,
    }))
    return { accommodationProofs: a }
}

export const getAccommodationProofById = async (id: AccommodationProofId) => {
    const { id: accommodationProofId } = accommodationProofIdSchema.parse({
        id,
    })
    const [row] = await db
        .select({
            accommodationProof: accommodationProofs,
            visaApplication: visaApplications,
        })
        .from(accommodationProofs)
        .where(eq(accommodationProofs.id, accommodationProofId))
        .leftJoin(
            visaApplications,
            eq(accommodationProofs.visaApplicationId, visaApplications.id),
        )
    if (row === undefined) return {}
    const a = {
        ...row.accommodationProof,
        visaApplication: row.visaApplication,
    }
    return { accommodationProof: a }
}
