import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import {
    StateId,
    NewStateParams,
    UpdateStateParams,
    updateStateSchema,
    insertStateSchema,
    states,
    stateIdSchema,
} from "@/lib/db/schema/states"

export const createState = async (state: NewStateParams) => {
    const newState = insertStateSchema.parse(state)
    try {
        const [s] = await db.insert(states).values(newState).returning()
        return { state: s }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateState = async (id: StateId, state: UpdateStateParams) => {
    const { id: stateId } = stateIdSchema.parse({ id })
    const newState = updateStateSchema.parse(state)
    try {
        const [s] = await db
            .update(states)
            .set({ ...newState, updatedAt: new Date() })
            .where(eq(states.id, stateId!))
            .returning()
        return { state: s }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteState = async (id: StateId) => {
    const { id: stateId } = stateIdSchema.parse({ id })
    try {
        const [s] = await db
            .delete(states)
            .where(eq(states.id, stateId!))
            .returning()
        return { state: s }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
