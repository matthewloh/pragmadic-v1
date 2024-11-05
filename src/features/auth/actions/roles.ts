"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { userRoles, users } from "@/lib/db/schema/users"
import { z } from "zod"
import { eq } from "drizzle-orm"

const assignRoleSchema = z.object({
    userId: z.string(),
    role: z.enum(["admin", "owner", "regular", "nomad"]),
})

type AssignRoleInput = z.infer<typeof assignRoleSchema>

const handleErrors = (e: unknown) => {
    const errMsg = "Error assigning role, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

export async function assignUserRoleAction(input: AssignRoleInput) {
    try {
        const { userId, role } = assignRoleSchema.parse(input)

        await db.transaction(async (tx) => {
            // Get current user and their roles
            const currentUser = await tx
                .select({ role: users.role })
                .from(users)
                .where(eq(users.id, userId))
            // Initialize roles array with "regular" if no roles exist
            console.log(currentUser)
            const existingRoles = currentUser[0]?.role
            console.log(existingRoles)
            // Add new role if it doesn't exist
            const updatedRoles = existingRoles.includes(role)
                ? existingRoles
                : [...existingRoles, role]
            console.log(updatedRoles)
            // Insert the new role into user_roles table
            await tx
                .insert(userRoles)
                .values({
                    userId,
                    role,
                })
                .onConflictDoNothing()

            // Update the users table with the appended roles
            await tx
                .update(users)
                .set({
                    role: updatedRoles,
                })
                .where(eq(users.id, userId))
        })

        revalidatePath("/getting-started")
        revalidatePath("/profile")
    } catch (e) {
        return handleErrors(e)
    }
}
