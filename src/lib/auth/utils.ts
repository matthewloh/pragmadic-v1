import { redirect } from "next/navigation"
import { getUserRole } from "./get-user-role"
import { AuthSession, UserMetadata } from "./types"

export const getUserAuth = async (): Promise<AuthSession> => {
    const { session, user_roles } = await getUserRole()

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
            roles: user_roles,
        },
    }
}
