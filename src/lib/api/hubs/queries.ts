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

export const getHubByIdWithEventsAndReviewsAndInvites = async (id: HubId) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")
    const { roles } = session
    const { id: hubId } = hubIdSchema.parse({ id })
    const rows = await db
        .select({
            hub: hubs,
            event: hubEvents,
            review: reviews,
            invite: usersToHubs,
        })
        .from(hubs)
        .where(and(eq(hubs.id, hubId)))
        .leftJoin(hubEvents, eq(hubs.id, hubEvents.hubId))
        .leftJoin(reviews, eq(hubs.id, reviews.hubId))
        .leftJoin(usersToHubs, eq(hubs.id, usersToHubs.hub_id))
    if (rows.length === 0) return {}
    const h = rows[0].hub
    const he = rows
        .filter((r) => r.event !== null)
        .map((e) => e.event) as CompleteEvent[]
    const hr = rows
        .filter((r) => r.review !== null)
        .map((r) => r.review) as CompleteReview[]
    const hi = rows
        .filter((r) => r.invite !== null)
        .map((r) => r.invite) as UsersToHub[]
    return { hub: h, events: he, reviews: hr, invites: hi }
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

export type HubUser = {
    id: string
    createdAt: Date | null
    email: string
    display_name: string | null
    image_url: string | null
    role: string[]
}

export const getHubUsersById = async (hubId: string) => {
    const { session } = await getUserAuth()
    if (!session) throw new Error("Unauthorized")

    const rows = await db
        .select({
            user: {
                id: users.id,
                createdAt: users.createdAt,
                email: users.email,
                display_name: users.display_name,
                image_url: users.image_url,
            },
            invite_role_type: usersToHubs.invite_role_type,
        })
        .from(usersToHubs)
        .innerJoin(users, eq(usersToHubs.user_id, users.id))
        .where(
            and(
                eq(usersToHubs.hub_id, hubId),
                eq(usersToHubs.invite_status, "accepted"),
            ),
        )

    const formattedUsers = rows.map((row) => ({
        ...row.user,
        role: [row.invite_role_type || "member"],
    })) satisfies HubUser[]

    return { users: formattedUsers }
}
