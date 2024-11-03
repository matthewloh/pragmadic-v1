"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { hubOwnerProfiles } from "@/lib/db/schema/hubOwnerProfiles"
import { updateUserRoleAction } from "@/features/auth/actions"
import { getUserAuth } from "@/lib/auth/utils"
import { insertHubOwnerProfileParams } from "@/lib/db/schema/hubOwnerProfiles"
import { z } from "zod"

const createProfileSchema = insertHubOwnerProfileParams.extend({
    userId: z.string(),
})

export async function createHubOwnerProfileAction(
    input: z.infer<typeof createProfileSchema>,
) {
    try {
        const { session } = await getUserAuth()
        if (!session) {
            throw new Error("Unauthorized")
        }

        const payload = createProfileSchema.parse(input)

        await db.insert(hubOwnerProfiles).values({
            ...payload,
            userId: session.user.id,
        })

        await updateUserRoleAction({
            id: session.user.id,
            role: ["owner"],
        })

        revalidatePath("/getting-started")
        revalidatePath("/profile")
    } catch (e) {
        const errMsg = "Error creating hub owner profile. Please try again."
        console.error(errMsg, e)
        return errMsg
    }
}
