import { db } from "@/lib/db/index"
import { eq, and, desc } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import {
    type HubId,
    hubIdSchema,
    hubs,
    UsersToHub,
    usersToHubs,
} from "@/lib/db/schema/hubs"
import { states } from "@/lib/db/schema/states"
import { hubEvents, type CompleteEvent } from "@/lib/db/schema/events"
import { reviews, type CompleteReview } from "@/lib/db/schema/reviews"
import { users } from "@/lib/db/schema/users"
import { UsersWithInviteStatus } from "@/lib/db/schema/users"
import { hubOwnerProfiles } from "@/lib/db/schema"

export const getHubs = async () => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")
    const rows = await db
        .select({ hub: hubs, state: states })
        .from(hubs)
        .leftJoin(states, eq(hubs.stateId, states.id))
    const h = rows.map((r) => ({ ...r.hub }))
    return { hubs: h }
}

export const getHubsOfUser = async () => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")
    const rows = await db
        .select({ hub: hubs, state: states })
        .from(hubs)
        .leftJoin(states, eq(hubs.stateId, states.id))
        .where(eq(hubs.userId, session.user.id))
    const h = rows.map((r) => ({ ...r.hub }))
    return { hubs: h }
}

export const getHubById = async (id: HubId) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")
    const { roles } = session
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

export const getHubByIdWithOwnerProfile = async (id: HubId) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")
    const { id: hubId } = hubIdSchema.parse({ id })
    const [row] = await db
        .select({ hub: hubs, user: users, hubOwnerProfile: hubOwnerProfiles })
        .from(hubs)
        .where(and(eq(hubs.id, hubId)))
        .leftJoin(users, eq(hubs.userId, users.id))
        .leftJoin(hubOwnerProfiles, eq(hubs.userId, hubOwnerProfiles.userId))
    if (row === undefined) return {}
    const h = {
        ...row.hub,
        user: row.user,
        hubOwnerProfile: row.hubOwnerProfile,
    }
    return { hub: h }
}

export const getHubByIdWithEventsAndReviewsAndInvites = async (id: HubId) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")
    const { roles } = session
    const { id: hubId } = hubIdSchema.parse({ id })

    // First get the hub and its related data
    const rows = await db
        .select({
            hub: hubs,
            event: hubEvents,
            review: reviews,
            invite: usersToHubs,
            user: users,
            hub_owner: {
                id: users.id,
                display_name: users.display_name,
                email: users.email,
                image_url: users.image_url,
                createdAt: users.createdAt,
            },
        })
        .from(hubs)
        .where(and(eq(hubs.id, hubId)))
        .leftJoin(hubEvents, eq(hubs.id, hubEvents.hubId))
        .leftJoin(reviews, eq(hubs.id, reviews.hubId))
        .leftJoin(usersToHubs, eq(hubs.id, usersToHubs.hub_id))
        .leftJoin(users, eq(usersToHubs.user_id, users.id))

    if (rows.length === 0) return {}

    const h = rows[0].hub
    const hubOwner = rows[0].hub_owner

    // Process events, reviews, and get unique users with their invite status
    const he = rows
        .filter((r) => r.event !== null)
        .map((e) => e.event) as CompleteEvent[]

    const hr = rows
        .filter((r) => r.review !== null)
        .map((r) => r.review) as CompleteReview[]

    // Get unique users with their invite status
    const hubUsers = rows
        .filter((r) => r.user !== null && r.invite !== null)
        .map((r) => ({
            ...r.user,
            invite_status: r.invite?.invite_status,
            invite_role_type: r.invite?.invite_role_type,
            hub_id: r.invite?.hub_id,
        }))
        // Remove duplicates based on user ID
        .filter(
            (user, index, self) =>
                index === self.findIndex((u) => u.id === user.id),
        ) as UsersWithInviteStatus[]

    return {
        hub: h,
        events: he,
        reviews: hr,
        users: hubUsers,
        hub_owner: hubOwner,
    }
}

export const getHubUsers = async (hubId: string) => {
    const rows = await db
        .select({
            id: users.id,
            name: users.display_name,
            email: users.email,
            inviteStatus: usersToHubs.invite_status,
            inviteRoleType: usersToHubs.invite_role_type,
        })
        .from(users)
        .innerJoin(usersToHubs, eq(users.id, usersToHubs.user_id))
        .where(eq(usersToHubs.hub_id, hubId))

    return { users: rows }
}

export const getUserHubs = async (userId: string) => {
    const rows = await db
        .select({
            hub: hubs,
            inviteStatus: usersToHubs.invite_status,
            inviteRoleType: usersToHubs.invite_role_type,
        })
        .from(usersToHubs)
        .innerJoin(hubs, eq(usersToHubs.hub_id, hubs.id))
        .where(eq(usersToHubs.user_id, userId))

    return { userHubs: rows }
}

export const getPendingHubInvites = async (userId: string) => {
    const rows = await db
        .select({
            hub: hubs,
            inviteStatus: usersToHubs.invite_status,
            inviteRoleType: usersToHubs.invite_role_type,
        })
        .from(usersToHubs)
        .innerJoin(hubs, eq(usersToHubs.hub_id, hubs.id))
        .where(
            and(
                eq(usersToHubs.user_id, userId),
                eq(usersToHubs.invite_status, "pending"),
            ),
        )

    return { pendingInvites: rows }
}

// Add these new queries
export const getHubInvitesByHubId = async (hubId: string) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")

    const invites = await db
        .select()
        .from(usersToHubs)
        .where(eq(usersToHubs.hub_id, hubId))
        .leftJoin(users, eq(usersToHubs.user_id, users.id))
        .orderBy(desc(usersToHubs.createdAt))

    return { users_to_hubs: invites }
}

export const getHubInviteById = async (hubId: string, userId: string) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")

    const [invite] = await db
        .select()
        .from(usersToHubs)
        .where(
            and(eq(usersToHubs.hub_id, hubId), eq(usersToHubs.user_id, userId)),
        )

    return { invite }
}

// Add this function to your existing queries
export const getHubByIdWithEvents = async (hubId: string) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")

    const hub = await db.query.hubs.findFirst({
        where: eq(hubs.id, hubId),
    })

    const events = !hub
        ? []
        : await db.query.hubEvents.findMany({
              where: eq(hubEvents.hubId, hub.id),
              orderBy: [desc(hubEvents.startDate)],
          })

    return { hub, events }
}

/* 
type UsersToHub = {
    createdAt: Date;
    user_id: string;
    hub_id: string;
    updatedAt: Date;
    invite_status: "pending" | "accepted" | "rejected" | null;
    invite_role_type: "admin" | "member" | null
}
*/

export const getAcceptedHubUsersByHubId = async (hubId: string) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")

    const rows = await db
        .select({
            id: users.id,
            createdAt: users.createdAt,
            email: users.email,
            display_name: users.display_name,
            image_url: users.image_url,
            invite_status: usersToHubs.invite_status,
            invite_role_type: usersToHubs.invite_role_type,
            hub_id: usersToHubs.hub_id,
        })
        .from(usersToHubs)
        .innerJoin(users, eq(usersToHubs.user_id, users.id))
        .where(
            and(
                eq(usersToHubs.hub_id, hubId),
                eq(usersToHubs.invite_status, "accepted"),
            ),
        )

    return {
        users: rows.map((row) => row as UsersWithInviteStatus),
    }
}

export const getAllHubUsersById = async (hubId: string) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")

    const rows = await db
        .select({
            id: users.id,
            createdAt: users.createdAt,
            email: users.email,
            display_name: users.display_name,
            image_url: users.image_url,
            invite_status: usersToHubs.invite_status,
            invite_role_type: usersToHubs.invite_role_type,
            hub_id: usersToHubs.hub_id,
        })
        .from(usersToHubs)
        .innerJoin(users, eq(usersToHubs.user_id, users.id))
        .where(eq(usersToHubs.hub_id, hubId))

    return {
        users: rows.map((row) => row as UsersWithInviteStatus),
    }
}
