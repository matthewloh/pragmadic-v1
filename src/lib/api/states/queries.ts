import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import { type StateId, stateIdSchema, states } from "@/lib/db/schema/states"
import { regions } from "@/lib/db/schema/regions"
import { hubs, type CompleteHub } from "@/lib/db/schema/hubs"

export const getStates = async () => {
    const rows = await db
        .select({ state: states, region: regions })
        .from(states)
        .leftJoin(regions, eq(states.regionId, regions.id))
    const s = rows.map((r) => ({ ...r.state, region: r.region }))
    return { states: s }
}

export const getStateById = async (id: StateId) => {
    const { id: stateId } = stateIdSchema.parse({ id })
    const [row] = await db
        .select({ state: states, region: regions })
        .from(states)
        .where(eq(states.id, stateId))
        .leftJoin(regions, eq(states.regionId, regions.id))
    if (row === undefined) return {}
    const s = { ...row.state, region: row.region }
    return { state: s }
}

export const getStateByIdWithHubs = async (id: StateId) => {
    const { id: stateId } = stateIdSchema.parse({ id })
    const rows = await db
        .select({ state: states, hub: hubs })
        .from(states)
        .where(eq(states.id, stateId))
        .leftJoin(hubs, eq(states.id, hubs.stateId))
    if (rows.length === 0) return {}
    const s = rows[0].state
    const sh = rows
        .filter((r) => r.hub !== null)
        .map((h) => h.hub) as CompleteHub[]

    return { state: s, hubs: sh }
}
