"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { userRoles } from "@/lib/db/schema/users"
import { z } from "zod"

const assignRoleSchema = z.object({
    userId: z.string(),
    role: z.enum(["owner", "nomad"]),
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

        // Insert the role into user_roles table
        await db.insert(userRoles).values({
            userId,
            role,
        })

        revalidatePath("/getting-started")
        revalidatePath("/profile")
    } catch (e) {
        return handleErrors(e)
    }
}
