import { getUserAuth } from "@/lib/auth/utils"
import { db } from "@/lib/db"
import {
    EventMarkerId,
    eventMarkers,
    insertEventMarkerSchema,
    NewEventMarkerParams,
    updateEventMarkerParams,
    UpdateEventMarkerParams,
} from "@/lib/db/schema/mapMarkers"
import { and, eq } from "drizzle-orm"

export const createEventMarker = async (data: NewEventMarkerParams) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")
    try {
        const payload = insertEventMarkerSchema.parse({
            ...data,
            userId: session.user.id,
        })
        const [marker] = await db
            .insert(eventMarkers)
            .values(payload)
            .returning()
        return marker
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateEventMarker = async (
    id: EventMarkerId,
    data: UpdateEventMarkerParams,
) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")

    const payload = updateEventMarkerParams.parse({
        ...data,
        userId: session.user.id,
    })

    try {
        const [marker] = await db
            .update(eventMarkers)
            .set({
                ...payload,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(eventMarkers.id, id),
                    eq(eventMarkers.userId, session.user.id),
                ),
            )
            .returning()

        return marker
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteEventMarker = async (id: EventMarkerId) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")

    await db.delete(eventMarkers).where(eq(eventMarkers.id, id))
}
