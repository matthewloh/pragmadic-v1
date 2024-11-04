"use server"

import { db } from "@/lib/db"
import { users, userRoles } from "@/lib/db/schema/users"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateUserSchema = z.object({
    id: z.string().uuid(),
    display_name: z.string().min(2).max(256),
    image_url: z.string().url().optional().nullable(),
})

export async function updateUserProfileAction(
    data: z.infer<typeof updateUserSchema>,
) {
    try {
        // Validate input
        const validated = updateUserSchema.parse(data)

        // Update user
        await db.transaction(async (tx) => {
            await tx
                .update(users)
                .set({
                    display_name: validated.display_name,
                    image_url: validated.image_url,
                })
                .where(eq(users.id, validated.id))

            // Ensure user has 'regular' role if they don't already
            const existingRole = await tx.query.userRoles.findFirst({
                where: eq(userRoles.userId, validated.id),
            })

            if (!existingRole) {
                await tx.insert(userRoles).values({
                    userId: validated.id,
                    role: "regular",
                })
            }
        })

        revalidatePath("/getting-started")
        return null
    } catch (error) {
        if (error instanceof z.ZodError) {
            return "Invalid input data: " + error.message
        }
        console.error("Error updating user profile:", error)
        return "Failed to update profile"
    }
}
