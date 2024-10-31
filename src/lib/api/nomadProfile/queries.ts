import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import {
    type NomadProfileId,
    nomadProfileIdSchema,
    nomadProfile,
} from "@/lib/db/schema/nomadProfile"
import { UserId } from "@/lib/db/schema"

export const getNomadProfiles = async () => {
    const { session } = await getUserAuth()
    const rows = await db
        .select()
        .from(nomadProfile)
        .where(eq(nomadProfile.userId, session?.user.id!))
    const n = rows
    return { nomadProfile: n }
}

export const getNomadProfileById = async (id: NomadProfileId) => {
    const { session } = await getUserAuth()
    const { id: nomadProfileId } = nomadProfileIdSchema.parse({ id })
    const [row] = await db
        .select()
        .from(nomadProfile)
        .where(
            and(
                eq(nomadProfile.id, nomadProfileId),
                eq(nomadProfile.userId, session?.user.id!),
            ),
        )
    if (row === undefined) return {}
    const n = row
    return { nomadProfile: n }
}

export const getNomadProfileByUserId = async (userId: UserId) => {
    const [row] = await db
        .select()
        .from(nomadProfile)
        .where(eq(nomadProfile.userId, userId))
    if (row === undefined) return { nomadProfile: null }
    const n = row
    return { nomadProfile: n }
}
