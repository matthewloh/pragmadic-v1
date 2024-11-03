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
    usersToHubs,
    insertUsersToHubSchema,
} from "@/lib/db/schema/hubs"
import { getUserAuth } from "@/lib/auth/utils"
import { getSession } from "@/utils/supabase/queries/cached-queries"
import { revalidatePath } from "next/cache"

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

export const inviteUserToHub = async (
    hubId: string,
    userId: string,
    inviteRoleType: "admin" | "member",
) => {
    const { session } = await getUserAuth()
    if (!session) {
        throw new Error("You must be logged in to invite users to a hub")
    }

    try {
        const [invitation] = await db
            .insert(usersToHubs)
            .values({
                hub_id: hubId,
                user_id: userId,
                invite_status: "pending",
                invite_role_type: inviteRoleType,
            })
            .returning()
        return { invitation }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const respondToHubInvitation = async (
    hubId: string,
    userId: string,
    response: "accepted" | "rejected",
) => {
    const { data } = await getSession()
    if (!data?.session || data.session.user.id !== userId) {
        throw new Error("You are not authorized to respond to this invitation")
    }

    try {
        const [updatedInvitation] = await db
            .update(usersToHubs)
            .set({ invite_status: response })
            .where(
                and(
                    eq(usersToHubs.hub_id, hubId),
                    eq(usersToHubs.user_id, userId),
                ),
            )
            .returning()
        return { updatedInvitation }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const joinPublicHub = async (hubId: string) => {
    const { session } = await getUserAuth()
    if (!session) {
        throw new Error("You must be logged in to join a hub")
    }

    try {
        // First, check if the hub is public
        const [hub] = await db.select().from(hubs).where(eq(hubs.id, hubId))
        if (!hub || !hub.public) {
            throw new Error("This hub is not public or does not exist")
        }

        // Then, add the user to the hub
        const [membership] = await db
            .insert(usersToHubs)
            .values({
                hub_id: hubId,
                user_id: session.user.id,
                invite_status: "accepted",
                invite_role_type: "member",
            })
            .returning()
        return { membership }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const leaveHub = async (hubId: string) => {
    const { session } = await getUserAuth()
    if (!session) {
        throw new Error("You must be logged in to leave a hub")
    }

    try {
        await db
            .delete(usersToHubs)
            .where(
                and(
                    eq(usersToHubs.hub_id, hubId),
                    eq(usersToHubs.user_id, session.user.id),
                ),
            )
        return { success: true }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const createHubJoinRequest = async (hubId: string) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")

    await db.insert(usersToHubs).values({
        hub_id: hubId,
        user_id: session.user.id,
        invite_status: "pending",
        invite_role_type: "member",
    })

    revalidatePath(`/hubs/${hubId}/invites`)
}
