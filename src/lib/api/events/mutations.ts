import { db } from "@/lib/db/index"
import { and, eq } from "drizzle-orm"
import {
    EventId,
    NewEventParams,
    UpdateEventParams,
    updateEventSchema,
    insertEventSchema,
    hubEvents,
    eventIdSchema,
} from "@/lib/db/schema/events"
import { getUserAuth } from "@/lib/auth/utils"

export const createEvent = async (event: NewEventParams) => {
    const { session } = await getUserAuth()
    const newEvent = insertEventSchema.parse({
        ...event,
        userId: session?.user.id!,
    })
    try {
        const [e] = await db.insert(hubEvents).values(newEvent).returning()
        return { event: e }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateEvent = async (id: EventId, event: UpdateEventParams) => {
    const { session } = await getUserAuth()
    const { id: eventId } = eventIdSchema.parse({ id })
    const newEvent = updateEventSchema.parse({
        ...event,
        userId: session?.user.id!,
    })
    try {
        const [e] = await db
            .update(hubEvents)
            .set({ ...newEvent, updatedAt: new Date() })
            .where(
                and(
                    eq(hubEvents.id, eventId!),
                    eq(hubEvents.userId, session?.user.id!),
                ),
            )
            .returning()
        return { event: e }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteEvent = async (id: EventId) => {
    const { session } = await getUserAuth()
    const { id: eventId } = eventIdSchema.parse({ id })
    try {
        const [e] = await db
            .delete(hubEvents)
            .where(
                and(
                    eq(hubEvents.id, eventId!),
                    eq(hubEvents.userId, session?.user.id!),
                ),
            )
            .returning()
        return { event: e }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
