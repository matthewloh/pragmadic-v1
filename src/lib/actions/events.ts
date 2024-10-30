"use server"

import { revalidatePath } from "next/cache"
import {
    createEvent,
    deleteEvent,
    updateEvent,
} from "@/lib/api/events/mutations"
import {
    EventId,
    NewEventParams,
    UpdateEventParams,
    eventIdSchema,
    insertEventParams,
    updateEventParams,
    usersToEvents,
} from "@/lib/db/schema/events"
import { getUserAuth } from "../auth/utils"
import { db } from "../db"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateEvents = () => revalidatePath("/events")

export const createEventAction = async (input: NewEventParams) => {
    try {
        const payload = insertEventParams.parse(input)
        await createEvent(payload)
        revalidateEvents()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateEventAction = async (input: UpdateEventParams) => {
    try {
        const payload = updateEventParams.parse(input)
        await updateEvent(payload.id, payload)
        revalidateEvents()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteEventAction = async (input: EventId) => {
    try {
        const payload = eventIdSchema.parse({ id: input })
        await deleteEvent(payload.id)
        revalidateEvents()
    } catch (e) {
        return handleErrors(e)
    }
}

export const inviteUserToEvent = async ({
    eventId,
    userId,
    inviteRoleType,
}: {
    eventId: string
    userId: string
    inviteRoleType: "admin" | "member"
}) => {
    const { session } = await getUserAuth()
    if (!session) {
        throw new Error("You must be logged in to invite users to an event")
    }

    await db.insert(usersToEvents).values({
        eventId,
        userId,
        invite_status: "pending",
        invite_role_type: inviteRoleType,
    })
}
