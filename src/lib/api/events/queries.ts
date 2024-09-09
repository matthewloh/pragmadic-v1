import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import { type EventId, eventIdSchema, events } from "@/lib/db/schema/events"
import { hubs } from "@/lib/db/schema/hubs"

export const getEvents = async () => {
    const { session } = await getUserAuth()
    const rows = await db
        .select({ event: events, hub: hubs })
        .from(events)
        .leftJoin(hubs, eq(events.hubId, hubs.id))
        .where(eq(events.userId, session?.user.id!))
    const e = rows.map((r) => ({ ...r.event, hub: r.hub }))
    return { events: e }
}

export const getEventById = async (id: EventId) => {
    const { session } = await getUserAuth()
    const { id: eventId } = eventIdSchema.parse({ id })
    const [row] = await db
        .select({ event: events, hub: hubs })
        .from(events)
        .where(
            and(eq(events.id, eventId), eq(events.userId, session?.user.id!)),
        )
        .leftJoin(hubs, eq(events.hubId, hubs.id))
    if (row === undefined) return {}
    const e = { ...row.event, hub: row.hub }
    return { event: e }
}
