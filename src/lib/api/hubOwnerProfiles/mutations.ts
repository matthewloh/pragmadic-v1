import { db } from "@/lib/db/index"
import { and, eq } from "drizzle-orm"
import {
    HubOwnerProfileId,
    NewHubOwnerProfileParams,
    UpdateHubOwnerProfileParams,
    updateHubOwnerProfileSchema,
    insertHubOwnerProfileSchema,
    hubOwnerProfiles,
    hubOwnerProfileIdSchema,
} from "@/lib/db/schema/hubOwnerProfiles"
import { checkAuth } from "@/lib/auth/utils"

export const createHubOwnerProfile = async (
    hubOwnerProfile: NewHubOwnerProfileParams,
) => {
    const { session } = await checkAuth()
    const newHubOwnerProfile = insertHubOwnerProfileSchema.parse({
        ...hubOwnerProfile,
        userId: session?.user.id!,
    })
    try {
        const [h] = await db
            .insert(hubOwnerProfiles)
            .values(newHubOwnerProfile)
            .returning()
        return { hubOwnerProfile: h }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateHubOwnerProfile = async (
    id: HubOwnerProfileId,
    hubOwnerProfile: UpdateHubOwnerProfileParams,
) => {
    const { session } = await checkAuth()
    const { id: hubOwnerProfileId } = hubOwnerProfileIdSchema.parse({ id })
    const newHubOwnerProfile = updateHubOwnerProfileSchema.parse({
        ...hubOwnerProfile,
        userId: session?.user.id!,
    })
    try {
        const [h] = await db
            .update(hubOwnerProfiles)
            .set({ ...newHubOwnerProfile, updatedAt: new Date() })
            .where(
                and(
                    eq(hubOwnerProfiles.id, hubOwnerProfileId!),
                    eq(hubOwnerProfiles.userId, session?.user.id!),
                ),
            )
            .returning()
        return { hubOwnerProfile: h }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteHubOwnerProfile = async (id: HubOwnerProfileId) => {
    const { session } = await checkAuth()
    const { id: hubOwnerProfileId } = hubOwnerProfileIdSchema.parse({ id })
    try {
        const [h] = await db
            .delete(hubOwnerProfiles)
            .where(
                and(
                    eq(hubOwnerProfiles.id, hubOwnerProfileId!),
                    eq(hubOwnerProfiles.userId, session?.user.id!),
                ),
            )
            .returning()
        return { hubOwnerProfile: h }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

