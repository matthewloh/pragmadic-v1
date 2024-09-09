import { db } from "@/lib/db/index"
import { and, eq } from "drizzle-orm"
import {
    HubId,
    NewHubParams,
    UpdateHubParams,
    updateHubSchema,
    insertHubSchema,
    hubs,
    hubIdSchema,
} from "@/lib/db/schema/hubs"
import { getUserAuth } from "@/lib/auth/utils"

export const createHub = async (hub: NewHubParams) => {
    const { session } = await getUserAuth()
    const newHub = insertHubSchema.parse({ ...hub, userId: session!.user.id! })
    try {
        const [h] = await db.insert(hubs).values(newHub).returning()
        return { hub: h }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateHub = async (id: HubId, hub: UpdateHubParams) => {
    const { session } = await getUserAuth()
    const { id: hubId } = hubIdSchema.parse({ id })
    const newHub = updateHubSchema.parse({ ...hub, userId: session!.user.id! })
    try {
        const [h] = await db
            .update(hubs)
            .set({ ...newHub, updatedAt: new Date() })
            .where(and(eq(hubs.id, hubId!), eq(hubs.userId, session!.user.id!)))
            .returning()
        return { hub: h }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteHub = async (id: HubId) => {
    const { session } = await getUserAuth()
    const { id: hubId } = hubIdSchema.parse({ id })
    try {
        const [h] = await db
            .delete(hubs)
            .where(and(eq(hubs.id, hubId!), eq(hubs.userId, session!.user.id!)))
            .returning()
        return { hub: h }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
