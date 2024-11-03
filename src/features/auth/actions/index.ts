"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema/users"
import { eq } from "drizzle-orm"
import { z } from "zod"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

// Schema for updating user profile
const updateUserSchema = z.object({
    id: z.string(),
    display_name: z.string().min(2).max(50),
    image_url: z.string().url().optional().nullable(),
})

export type UpdateUserParams = z.infer<typeof updateUserSchema>

export async function updateUserAction(input: UpdateUserParams) {
    try {
        const payload = updateUserSchema.parse(input)
        await db
            .update(users)
            .set({
                display_name: payload.display_name,
                image_url: payload.image_url,
            })
            .where(eq(users.id, payload.id))

        revalidatePath("/getting-started")
        revalidatePath("/profile")
    } catch (e) {
        return handleErrors(e)
    }
}

// Schema for updating user role
const updateUserRoleSchema = z.object({
    id: z.string(),
    role: z.array(z.enum(["admin", "owner", "regular"])),
})

export type UpdateUserRoleParams = z.infer<typeof updateUserRoleSchema>

export async function updateUserRoleAction(input: UpdateUserRoleParams) {
    try {
        const payload = updateUserRoleSchema.parse(input)
        await db
            .update(users)
            .set({ role: payload.role })
            .where(eq(users.id, payload.id))

        revalidatePath("/getting-started")
        revalidatePath("/profile")
    } catch (e) {
        return handleErrors(e)
    }
}
