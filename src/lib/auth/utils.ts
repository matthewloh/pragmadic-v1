import { createClient } from "@/utils/supabase/server"
import { AuthSession, UserMetadata } from "./types"
import { getSession } from "../../../supabase/queries/cached-queries"
import { redirect } from "next/navigation"
import { getUserRole } from "./get-user-role"

export const checkAuth = async () => {
    const {
        data: { session },
    } = await getSession()
    if (!session) redirect("/login")
}

export const getUserAuth = async (): Promise<AuthSession> => {
    const { session, role } = await getUserRole()
    if (!session?.user.id) {
        redirect("/login")
    }
    return {
        session: {
            user: {
                id: session.user.id,
                email: session.user.email!,
                user_metadata: session.user.user_metadata! as UserMetadata,
            },
            role: role || undefined,
        },
    }
}
