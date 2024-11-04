"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { hubOwnerProfiles, nomadProfile, userRoles } from "../db/schema"

export async function createRoleAndProfile(
    userId: string,
    role: "nomad" | "owner",
    profileData: any,
) {
    try {
        await db.transaction(async (tx) => {
            // Add role
            await tx.insert(userRoles).values({
                userId,
                role: role === "nomad" ? "nomad" : "owner",
            })

            // Create corresponding profile
            if (role === "nomad") {
                await tx.insert(nomadProfile).values({
                    userId,
                    ...profileData,
                })
            } else {
                await tx.insert(hubOwnerProfiles).values({
                    userId,
                    ...profileData,
                })
            }
        })

        revalidatePath("/getting-started")
        return { success: true }
    } catch (error) {
        console.error("Error in createRoleAndProfile:", error)
        return { success: false, error: "Failed to create profile" }
    }
}
