import { db } from "@/lib/db/index"
import { and, eq } from "drizzle-orm"
import {
    DerantauAdminProfileId,
    NewDerantauAdminProfileParams,
    UpdateDerantauAdminProfileParams,
    updateDerantauAdminProfileSchema,
    insertDerantauAdminProfileSchema,
    derantauAdminProfile as derantauAdminProfileSchema,
    derantauAdminProfileIdSchema,
} from "@/lib/db/schema/derantauAdminProfile"
import { getUserAuth } from "@/lib/auth/utils"

export const createDerantauAdminProfile = async (
    derantauAdminProfile: NewDerantauAdminProfileParams,
) => {
    const { session } = await getUserAuth()
    const newDerantauAdminProfile = insertDerantauAdminProfileSchema.parse({
        ...derantauAdminProfile,
        userId: session?.user.id!,
    })
    try {
        const [d] = await db
            .insert(derantauAdminProfileSchema)
            .values(newDerantauAdminProfile)
            .returning()
        return { derantauAdminProfile: d }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateDerantauAdminProfile = async (
    id: DerantauAdminProfileId,
    derantauAdminProfile: UpdateDerantauAdminProfileParams,
) => {
    const { session } = await getUserAuth()
    const { id: derantauAdminProfileId } = derantauAdminProfileIdSchema.parse({
        id,
    })
    const newDerantauAdminProfile = updateDerantauAdminProfileSchema.parse({
        ...derantauAdminProfile,
        userId: session?.user.id!,
    })
    try {
        const [d] = await db
            .update(derantauAdminProfileSchema)
            .set({ ...newDerantauAdminProfile, updatedAt: new Date() })
            .where(
                and(
                    eq(derantauAdminProfileSchema.id, derantauAdminProfileId!),
                    eq(derantauAdminProfileSchema.userId, session?.user.id!),
                ),
            )
            .returning()
        return { derantauAdminProfile: d }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteDerantauAdminProfile = async (
    id: DerantauAdminProfileId,
) => {
    const { session } = await getUserAuth()
    const { id: derantauAdminProfileId } = derantauAdminProfileIdSchema.parse({
        id,
    })
    try {
        const [d] = await db
            .delete(derantauAdminProfileSchema)
            .where(
                and(
                    eq(derantauAdminProfileSchema.id, derantauAdminProfileId!),
                    eq(derantauAdminProfileSchema.userId, session?.user.id!),
                ),
            )
            .returning()
        return { derantauAdminProfile: d }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
