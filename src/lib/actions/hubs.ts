"use server"

import { revalidatePath } from "next/cache"
import {
    createHub,
    createHubJoinRequest,
    deleteHub,
    updateHub,
} from "@/lib/api/hubs/mutations"
import {
    HubId,
    NewHubParams,
    UpdateHubParams,
    hubIdSchema,
    insertHubParams,
    updateHubParams,
} from "@/lib/db/schema/hubs"
import { kv } from "@vercel/kv"
import { Ratelimit } from "@upstash/ratelimit"
import { headers } from "next/headers"

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.fixedWindow(4, "60s"), // 4 attempts per minute
})

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateHubs = () => revalidatePath("/hubs")

export const createHubAction = async (input: NewHubParams) => {
    try {
        const payload = insertHubParams.parse(input)
        await createHub(payload)
        revalidateHubs()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateHubAction = async (input: UpdateHubParams) => {
    try {
        const payload = updateHubParams.parse(input)
        await updateHub(payload.id, payload)
        revalidateHubs()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteHubAction = async (input: HubId) => {
    try {
        const payload = hubIdSchema.parse({ id: input })
        await deleteHub(payload.id)
        revalidateHubs()
    } catch (e) {
        return handleErrors(e)
    }
}
export const createHubJoinRequestAction = async (hubId: string) => {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") ?? "ip"
    const { success } = await ratelimit.limit(ip)
    if (!success) {
        return "Too many requests. Please try again later."
    }
    try {
        await createHubJoinRequest(hubId)
    } catch (e) {
        return handleErrors(e)
    }
}
