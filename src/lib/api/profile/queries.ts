import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import {
    type ProfileId,
    profileIdSchema,
    profile,
} from "@/lib/db/schema/profile"

export const getProfiles = async () => {
    const { session } = await getUserAuth()
    const rows = await db
        .select()
        .from(profile)
        .where(eq(profile.userId, session?.user.id!))
    const p = rows
    return { profile: p }
}

export const getSingleProfile = async () => {
    const { session } = await getUserAuth()
    const [row] = await db
        .select()
        .from(profile)
        .where(eq(profile.userId, session?.user.id!))
    if (row === undefined) return {}
    const p = row
    return { profile: p }
}

export const getProfileById = async (id: ProfileId) => {
    const { session } = await getUserAuth()
    const { id: profileId } = profileIdSchema.parse({ id })
    const [row] = await db
        .select()
        .from(profile)
        .where(
            and(
                eq(profile.id, profileId),
                eq(profile.userId, session?.user.id!),
            ),
        )
    if (row === undefined) return {}
    const p = row
    return { profile: p }
}
