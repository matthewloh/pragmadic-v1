import { db } from "@/lib/db/index"
import { and, eq } from "drizzle-orm"
import {
    ProfileId,
    NewProfileParams,
    UpdateProfileParams,
    updateProfileSchema,
    insertProfileSchema,
    profile as profileSchema,
    profileIdSchema,
} from "@/lib/db/schema/profile"
import { getUserAuth } from "@/lib/auth/utils"

export const createProfile = async (profile: NewProfileParams) => {
    const { session } = await getUserAuth()
    const existingProfile = await db
        .select()
        .from(profileSchema)
        .where(eq(profileSchema.userId, session?.user.id!))
    if (existingProfile.length > 0) {
        throw { error: "Profile already exists" }
    }
    const newProfile = insertProfileSchema.parse({
        ...profile,
        userId: session?.user.id!,
    })
    try {
        const [p] = await db
            .insert(profileSchema)
            .values(newProfile)
            .returning()
        return { profile: p }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateProfile = async (
    id: ProfileId,
    profile: UpdateProfileParams,
) => {
    const { session } = await getUserAuth()
    const { id: profileId } = profileIdSchema.parse({ id })
    const newProfile = updateProfileSchema.parse({
        ...profile,
        userId: session?.user.id!,
    })
    try {
        const [p] = await db
            .update(profileSchema)
            .set({ ...newProfile, updatedAt: new Date() })
            .where(
                and(
                    eq(profileSchema.id, profileId!),
                    eq(profileSchema.userId, session?.user.id!),
                ),
            )
            .returning()
        return { profile: p }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteProfile = async (id: ProfileId) => {
    const { session } = await getUserAuth()
    const { id: profileId } = profileIdSchema.parse({ id })
    try {
        const [p] = await db
            .delete(profileSchema)
            .where(
                and(
                    eq(profileSchema.id, profileId!),
                    eq(profileSchema.userId, session?.user.id!),
                ),
            )
            .returning()
        return { profile: p }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

