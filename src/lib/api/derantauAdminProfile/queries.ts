import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import {
    type DerantauAdminProfileId,
    derantauAdminProfileIdSchema,
    derantauAdminProfile,
} from "@/lib/db/schema/derantauAdminProfile"
import { regions } from "@/lib/db/schema/regions"
import { getRegions } from "../regions/queries"

export const getDerantauAdminProfiles = async () => {
    const { session } = await getUserAuth()
    const rows = await db
        .select({ derantauAdminProfile: derantauAdminProfile, region: regions })
        .from(derantauAdminProfile)
        .leftJoin(regions, eq(derantauAdminProfile.regionId, regions.id))
        .where(eq(derantauAdminProfile.userId, session?.user.id!))
    const d = rows.map((r) => ({ ...r.derantauAdminProfile, region: r.region }))
    return { derantauAdminProfile: d }
}

export const getSingleDerantauAdminProfile = async () => {
    const { session } = await getUserAuth()
    const [row] = await db
        .select({ derantauAdminProfile: derantauAdminProfile })
        .from(derantauAdminProfile)
        .where(eq(derantauAdminProfile.userId, session?.user.id!))
    const regions = await getRegions()
    if (row === undefined) return {}

    return { derantauAdminProfile: row, regions }
}

export const getDerantauAdminProfileById = async (
    id: DerantauAdminProfileId,
) => {
    const { session } = await getUserAuth()
    const { id: derantauAdminProfileId } = derantauAdminProfileIdSchema.parse({
        id,
    })
    const [row] = await db
        .select({ derantauAdminProfile: derantauAdminProfile, region: regions })
        .from(derantauAdminProfile)
        .where(
            and(
                eq(derantauAdminProfile.id, derantauAdminProfileId),
                eq(derantauAdminProfile.userId, session?.user.id!),
            ),
        )
        .leftJoin(regions, eq(derantauAdminProfile.regionId, regions.id))
    if (row === undefined) return {}
    const d = { ...row.derantauAdminProfile, region: row.region }
    return { derantauAdminProfile: d }
}
