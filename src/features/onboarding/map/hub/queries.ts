import { getUserAuth } from "@/lib/auth/utils"
import { db } from "@/lib/db"
import { eventIdSchema } from "@/lib/db/schema"
import { hubMarkers, eventMarkers } from "@/lib/db/schema/mapMarkers"
import { eq } from "drizzle-orm"

export async function getHubMarkers() {
    try {
        return await db.select().from(hubMarkers)
    } catch (error) {
        throw new Error("Failed to fetch hub markers")
    }
}

export async function getHubMarkerById(id: string) {
    try {
        const [marker] = await db
            .select()
            .from(hubMarkers)
            .where(eq(hubMarkers.id, id))
        return marker
    } catch (error) {
        throw new Error("Failed to fetch hub marker")
    }
}

export async function getHubMarkerByHubId(hubId: string) {
    try {
        const [marker] = await db
            .select()
            .from(hubMarkers)
            .where(eq(hubMarkers.hubId, hubId))
        return marker
    } catch (error) {
        throw new Error("Failed to fetch hub marker")
    }
}

export async function getEventMarkers() {
    try {
        return await db.select().from(eventMarkers)
    } catch (error) {
        throw new Error("Failed to fetch event markers")
    }
}

export async function getEventMarkerById(id: string) {
    try {
        const [marker] = await db
            .select()
            .from(eventMarkers)
            .where(eq(eventMarkers.id, id))
        return marker
    } catch (error) {
        throw new Error("Failed to fetch event marker")
    }
}

export async function getEventMarkerByEventId(event_id: string) {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")

    const [marker] = await db
        .select()
        .from(eventMarkers)
        .where(eq(eventMarkers.eventId, event_id))
    return marker
}
