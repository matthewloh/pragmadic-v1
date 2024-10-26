import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import { type HubId, hubIdSchema, hubs } from "@/lib/db/schema/hubs"
import { states } from "@/lib/db/schema/states"
import { events, type CompleteEvent } from "@/lib/db/schema/events"
import { reviews, type CompleteReview } from "@/lib/db/schema/reviews"

export const getHubs = async () => {
    const { session } = await getUserAuth()
    const rows = await db
        .select({ hub: hubs, state: states })
        .from(hubs)
        .leftJoin(states, eq(hubs.stateId, states.id))
    const h = rows.map((r) => ({ ...r.hub, state: r.state }))
    return { hubs: h }
}

export const getHubById = async (id: HubId) => {
    const { session } = await getUserAuth()
    const { id: hubId } = hubIdSchema.parse({ id })
    const [row] = await db
        .select({ hub: hubs, state: states })
        .from(hubs)
        .where(and(eq(hubs.id, hubId)))
        .leftJoin(states, eq(hubs.stateId, states.id))
    if (row === undefined) return {}
    const h = { ...row.hub, state: row.state }
    return { hub: h }
}

export const getHubByIdWithEventsAndReviews = async (id: HubId) => {
    const { session } = await getUserAuth()
    const { id: hubId } = hubIdSchema.parse({ id })
    const rows = await db
        .select({ hub: hubs, event: events, review: reviews })
        .from(hubs)
        .where(and(eq(hubs.id, hubId)))
        .leftJoin(events, eq(hubs.id, events.hubId))
        .leftJoin(reviews, eq(hubs.id, reviews.hubId))
    if (rows.length === 0) return {}
    const h = rows[0].hub
    const he = rows
        .filter((r) => r.event !== null)
        .map((e) => e.event) as CompleteEvent[]
    const hr = rows
        .filter((r) => r.review !== null)
        .map((r) => r.review) as CompleteReview[]

    return { hub: h, events: he, reviews: hr }
}
