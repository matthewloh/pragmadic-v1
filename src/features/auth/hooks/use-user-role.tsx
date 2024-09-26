import { useQuery } from "@tanstack/react-query"
import { AuthError, Session, User } from "@supabase/supabase-js"
import { jwtDecode } from "jwt-decode"
import type { JwtPayload } from "jwt-decode"

import { createClient } from "@/utils/supabase/client"

type SupabaseJwtPayload = JwtPayload & {
    app_metadata: {
        role: string
    }
}

type UserRoleData = {
    session: Session | null
    user: User | null
    role: string | null
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
                role: decodedJwt.app_metadata.role,
            }
        }

        return { session: null, user: null, role: null }
    }

    const { data, error, isLoading } = useQuery<UserRoleData, AuthError>({
        queryKey: ["userRole"],
        queryFn: fetchUserRole,
    })

    return {
        loading: isLoading,
        error,
        session: data?.session ?? null,
        user: data?.user ?? null,
        role: data?.role ?? null,
    }
}
