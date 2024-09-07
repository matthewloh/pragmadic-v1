import { db } from "@/lib/db/index"
import { and, eq } from "drizzle-orm"
import {
    VisaApplicationId,
    NewVisaApplicationParams,
    UpdateVisaApplicationParams,
    updateVisaApplicationSchema,
    insertVisaApplicationSchema,
    visaApplications,
    visaApplicationIdSchema,
} from "@/lib/db/schema/visaApplications"
import { checkAuth } from "@/lib/auth/utils"

export const createVisaApplication = async (
    visaApplication: NewVisaApplicationParams,
) => {
    const { session } = await checkAuth()
    const newVisaApplication = insertVisaApplicationSchema.parse({
        ...visaApplication,
        userId: session?.user.id!,
    })
    try {
        const [v] = await db
            .insert(visaApplications)
            .values(newVisaApplication)
            .returning()
        return { visaApplication: v }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateVisaApplication = async (
    id: VisaApplicationId,
    visaApplication: UpdateVisaApplicationParams,
) => {
    const { session } = await checkAuth()
    const { id: visaApplicationId } = visaApplicationIdSchema.parse({ id })
    const newVisaApplication = updateVisaApplicationSchema.parse({
        ...visaApplication,
        userId: session?.user.id!,
    })
    try {
        const [v] = await db
            .update(visaApplications)
            .set({ ...newVisaApplication, updatedAt: new Date() })
            .where(
                and(
                    eq(visaApplications.id, visaApplicationId!),
                    eq(visaApplications.userId, session?.user.id!),
                ),
            )
            .returning()
        return { visaApplication: v }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteVisaApplication = async (id: VisaApplicationId) => {
    const { session } = await checkAuth()
    const { id: visaApplicationId } = visaApplicationIdSchema.parse({ id })
    try {
        const [v] = await db
            .delete(visaApplications)
            .where(
                and(
                    eq(visaApplications.id, visaApplicationId!),
                    eq(visaApplications.userId, session?.user.id!),
                ),
            )
            .returning()
        return { visaApplication: v }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
