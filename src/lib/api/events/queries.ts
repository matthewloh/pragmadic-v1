import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import {
    type EventId,
    eventIdSchema,
    hubEvents,
    UsersToEvents,
    usersToEvents,
} from "@/lib/db/schema/events"
import { hubs } from "@/lib/db/schema/hubs"
import { SelectUser, users } from "@/lib/db/schema/users"

export const getEvents = async () => {
    const { session } = await getUserAuth()
    const rows = await db
        .select({ event: hubEvents, hub: hubs })
        .from(hubEvents)
        .leftJoin(hubs, eq(hubEvents.hubId, hubs.id))
    const e = rows.map((r) => ({ ...r.event, hub: r.hub }))
    return { events: e }
}

export const getEventById = async (id: EventId) => {
    const { session } = await getUserAuth()
    const { id: eventId } = eventIdSchema.parse({ id })
    const [row] = await db
        .select({ event: hubEvents, hub: hubs })
        .from(hubEvents)
        .where(
            and(
                eq(hubEvents.id, eventId),
                eq(hubEvents.userId, session?.user.id!),
            ),
        )
        .leftJoin(hubs, eq(hubEvents.hubId, hubs.id))
    if (row === undefined) return {}
    const e = { ...row.event, hub: row.hub }
    return { event: e }
}

export const getParticipantsByEventId = async (id: EventId) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")
    const { id: eventId } = eventIdSchema.parse({ id })

    const participants = await db
        .select({
            user: {
                id: users.id,
                name: users.display_name,
                email: users.email,
            },
            eventParticipation: {
                inviteStatus: usersToEvents.invite_status,
                inviteRoleType: usersToEvents.invite_role_type,
            },
        })
        .from(usersToEvents)
        .innerJoin(users, eq(usersToEvents.userId, users.id))
        .where(eq(usersToEvents.eventId, eventId))

    return participants
}
