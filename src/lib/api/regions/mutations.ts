import { db } from "@/lib/db"
import { and, eq } from "drizzle-orm"
import {
    RegionId,
    NewRegionParams,
    UpdateRegionParams,
    updateRegionSchema,
    insertRegionSchema,
    regions,
    regionIdSchema,
} from "@/lib/db/schema/regions"
import { checkAuth } from "@/lib/auth/utils"

export const createRegion = async (region: NewRegionParams) => {
    const { session } = await checkAuth()
    const newRegion = insertRegionSchema.parse({
        ...region,
        userId: session?.user.id,
    })
    try {
        const [r] = await db.insert(regions).values(newRegion).returning()
        return { region: r }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateRegion = async (
    id: RegionId,
    region: UpdateRegionParams,
) => {
    const { session } = await checkAuth()
    const { id: regionId } = regionIdSchema.parse({ id })
    const newRegion = updateRegionSchema.parse({
        ...region,
        userId: session!.user.id!,
    })
    try {
        const [r] = await db
            .update(regions)
            .set({ ...newRegion, updatedAt: new Date() })
            .where(
                and(
                    eq(regions.id, regionId!),
                    eq(regions.userId, session?.user.id!),
                ),
            )
            .returning()
        return { region: r }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteRegion = async (id: RegionId) => {
    const { session } = await checkAuth()
    const { id: regionId } = regionIdSchema.parse({ id })
    try {
        const [r] = await db
            .delete(regions)
            .where(
                and(
                    eq(regions.id, regionId!),
                    eq(regions.userId, session?.user.id!),
                ),
            )
            .returning()
        return { region: r }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
