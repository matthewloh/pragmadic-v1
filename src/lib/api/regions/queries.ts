import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import { type RegionId, regionIdSchema, regions } from "@/lib/db/schema/regions"
import { states, type CompleteState } from "@/lib/db/schema/states"

export const getRegions = async () => {
    const { session } = await getUserAuth()
    const rows = await db
        .select()
        .from(regions)
    const r = rows
    return { regions: r }
}

export const getRegionById = async (id: RegionId) => {
    const { session } = await getUserAuth()
    const { id: regionId } = regionIdSchema.parse({ id })
    const [row] = await db
        .select()
        .from(regions)
        .where(
            and(
                eq(regions.id, regionId),
                eq(regions.userId, session?.user.id!),
            ),
        )
    if (row === undefined) return {}
    const r = row
    return { region: r }
}

export const getRegionByIdWithStates = async (id: RegionId) => {
    const { session } = await getUserAuth()
    const { id: regionId } = regionIdSchema.parse({ id })
    const rows = await db
        .select({
            region: regions,
            state: states,
        })
        .from(regions)
        .where(
            and(
                eq(regions.id, regionId),
                eq(regions.userId, session?.user.id!),
            ),
        )
        .leftJoin(states, eq(regions.id, states.regionId))
    if (rows.length === 0) return {}
    const r = rows[0].region
    const rs = rows
        .filter((r) => r.state !== null)
        .map((s) => s.state) as CompleteState[]

    return { region: r, states: rs }
}
