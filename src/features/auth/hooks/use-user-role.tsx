import { useQuery } from "@tanstack/react-query"
import { AuthError, Session, User } from "@supabase/supabase-js"
import { jwtDecode } from "jwt-decode"
import type { JwtPayload } from "jwt-decode"

import { createClient } from "@/utils/supabase/client"
import { RoleType } from "@/lib/auth/get-user-role"

type SupabaseJwtPayload = JwtPayload & {
    app_metadata: {
        user_roles: RoleType[]
    }
}

type UserRoleData = {
    session: Session | null
    user: User | null
    user_roles: RoleType[] 
}

export function useUserRole() {
    const supabase = createClient()

    const fetchUserRole = async (): Promise<UserRoleData> => {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession()
        if (error) throw error

        if (session) {
            const decodedJwt = jwtDecode<SupabaseJwtPayload>(
                session.access_token,
            )
            return {
                session,
                user: session.user,
                user_roles: decodedJwt.app_metadata.user_roles,
            }
        }

        return { session: null, user: null, user_roles: [] }
    }

    return useQuery<UserRoleData, AuthError>({
        queryKey: ["user-role"],
        queryFn: fetchUserRole,
    })
}
