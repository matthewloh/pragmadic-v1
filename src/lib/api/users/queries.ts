import { getUserAuth } from "@/lib/auth/utils"
import { db } from "@/lib/db"

export const getUsers = async () => {
    const { session } = await getUserAuth()
    const rows = await db.query.users.findMany()
    const u = rows
    return { users: u }
}
