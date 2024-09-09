import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import {
    type HubOwnerProfileId,
    hubOwnerProfileIdSchema,
    hubOwnerProfiles,
} from "@/lib/db/schema/hubOwnerProfiles"

export const getHubOwnerProfiles = async () => {
    const { session } = await getUserAuth()
    const rows = await db
        .select()
        .from(hubOwnerProfiles)
        .where(eq(hubOwnerProfiles.userId, session?.user.id!))
    const h = rows
    return { hubOwnerProfiles: h }
}

export const getHubOwnerProfileById = async (id: HubOwnerProfileId) => {
    const { session } = await getUserAuth()
    const { id: hubOwnerProfileId } = hubOwnerProfileIdSchema.parse({ id })
    const [row] = await db
        .select()
        .from(hubOwnerProfiles)
        .where(
            and(
                eq(hubOwnerProfiles.id, hubOwnerProfileId),
                eq(hubOwnerProfiles.userId, session?.user.id!),
            ),
        )
    if (row === undefined) return {}
    const h = row
    return { hubOwnerProfile: h }
}

