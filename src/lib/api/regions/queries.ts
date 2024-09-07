import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { checkAuth } from "@/lib/auth/utils"
import { type RegionId, regionIdSchema, regions } from "@/lib/db/schema/regions"
import { states, type CompleteState } from "@/lib/db/schema/states"
import {
    visaApplications,
    type CompleteVisaApplication,
} from "@/lib/db/schema/visaApplications"

export const getRegions = async () => {
    const { session } = await checkAuth()
    const rows = await db
        .select()
        .from(regions)
        .where(eq(regions.userId, session?.user.id!))
    const r = rows
    return { regions: r }
}

export const getRegionById = async (id: RegionId) => {
    const { session } = await checkAuth()
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

export const getRegionByIdWithStatesAndVisaApplications = async (
    id: RegionId,
) => {
    const { session } = await checkAuth()
    const { id: regionId } = regionIdSchema.parse({ id })
    const rows = await db
        .select({
            region: regions,
            state: states,
            visaApplication: visaApplications,
        })
        .from(regions)
        .where(
            and(
                eq(regions.id, regionId),
                eq(regions.userId, session?.user.id!),
            ),
        )
        .leftJoin(states, eq(regions.id, states.regionId))
        .leftJoin(visaApplications, eq(regions.id, visaApplications.regionId))
    if (rows.length === 0) return {}
    const r = rows[0].region
    const rs = rows
        .filter((r) => r.state !== null)
        .map((s) => s.state) as CompleteState[]
    const rv = rows
        .filter((r) => r.visaApplication !== null)
        .map((v) => v.visaApplication) as CompleteVisaApplication[]

    return { region: r, states: rs, visaApplications: rv }
}
