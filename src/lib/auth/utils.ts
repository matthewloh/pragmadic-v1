import { redirect } from "next/navigation"
import { getSession } from "../../utils/supabase/queries/cached-queries"
import { getUserRole } from "./get-user-role"
import { AuthSession, UserMetadata } from "./types"

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
