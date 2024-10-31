"use server"

import { getUserAuth } from "@/lib/auth/utils"
import {
    EventMarkerId,
    insertEventMarkerParams,
    UpdateEventMarkerParams,
    updateEventMarkerParams,
    type NewEventMarkerParams,
} from "@/lib/db/schema/mapMarkers"
import { revalidatePath } from "next/cache"
import {
    createEventMarker,
    deleteEventMarker,
    updateEventMarker,
} from "./mutations"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateMarkers = () => revalidatePath("/events/")

export const createEventMarkerAction = async (input: NewEventMarkerParams) => {
    try {
        const { session } = await getUserAuth()
        if (!session) throw new Error("Unauthorized")

        const payload = insertEventMarkerParams.parse({
            ...input,
            userId: session.user.id,
        })
        await createEventMarker(payload)
        revalidateMarkers()
        return null
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateEventMarkerAction = async (
    id: EventMarkerId,
    input: UpdateEventMarkerParams,
) => {
    try {
        const { session } = await getUserAuth()
        if (!session) throw new Error("Unauthorized")

        const payload = updateEventMarkerParams.parse({
            ...input,
            userId: session.user.id,
        })
        await updateEventMarker(id, payload)
        revalidateMarkers()
        return null
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteEventMarkerAction = async (id: string) => {
    try {
        const { session } = await getUserAuth()
        if (!session) throw new Error("Unauthorized")

        await deleteEventMarker(id)
        revalidateMarkers()
        return null
    } catch (e) {
        return handleErrors(e)
    }
}
