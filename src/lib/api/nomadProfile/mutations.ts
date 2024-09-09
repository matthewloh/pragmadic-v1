import { db } from "@/lib/db/index"
import { and, eq } from "drizzle-orm"
import {
    NomadProfileId,
    NewNomadProfileParams,
    UpdateNomadProfileParams,
    updateNomadProfileSchema,
    insertNomadProfileSchema,
    nomadProfile as nomadProfileSchema,
    nomadProfileIdSchema,
} from "@/lib/db/schema/nomadProfile"
import { getUserAuth } from "@/lib/auth/utils"

export const createNomadProfile = async (
    nomadProfile: NewNomadProfileParams,
) => {
    const { session } = await getUserAuth()
    const newNomadProfile = insertNomadProfileSchema.parse({
        ...nomadProfile,
        userId: session?.user.id!,
    })
    try {
        const [n] = await db
            .insert(nomadProfileSchema)
            .values(newNomadProfile)
            .returning()
        return { nomadProfile: n }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateNomadProfile = async (
    id: NomadProfileId,
    nomadProfile: UpdateNomadProfileParams,
) => {
    const { session } = await getUserAuth()
    const { id: nomadProfileId } = nomadProfileIdSchema.parse({ id })
    const newNomadProfile = updateNomadProfileSchema.parse({
        ...nomadProfile,
        userId: session?.user.id!,
    })
    try {
        const [n] = await db
            .update(nomadProfileSchema)
            .set({ ...newNomadProfile, updatedAt: new Date() })
            .where(
                and(
                    eq(nomadProfileSchema.id, nomadProfileId!),
                    eq(nomadProfileSchema.userId, session?.user.id!),
                ),
            )
            .returning()
        return { nomadProfile: n }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteNomadProfile = async (id: NomadProfileId) => {
    const { session } = await getUserAuth()
    const { id: nomadProfileId } = nomadProfileIdSchema.parse({ id })
    try {
        const [n] = await db
            .delete(nomadProfileSchema)
            .where(
                and(
                    eq(nomadProfileSchema.id, nomadProfileId!),
                    eq(nomadProfileSchema.userId, session?.user.id!),
                ),
            )
            .returning()
        return { nomadProfileSchema: n }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
