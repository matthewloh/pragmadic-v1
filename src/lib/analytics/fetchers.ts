import { db } from "@/lib/db"
import { nomadProfile } from "@/lib/db/schema/nomadProfile"
import { eq, gte } from "drizzle-orm"
import { hubEvents } from "../db/schema"
import { getUserAuth } from "../auth/utils"

export async function fetchDemographicData(aspect: string) {
    const { session } = await getUserAuth()
    if (!session) {
        throw new Error("Unauthorized")
    }
    const data = await db
        .select()
        .from(nomadProfile)
        .where(eq(nomadProfile.skills, aspect))
    return data
}

function getTimeframe(timeframe: string) {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return timeframe === "weekly" ? oneWeekAgo : now
}

export async function fetchHistoricalEvents(timeframe: string) {
    const data = await db
        .select()
        .from(hubEvents)
        .where(gte(hubEvents.createdAt, getTimeframe(timeframe)))
    return data
}
