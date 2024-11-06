import { useQuery } from "@tanstack/react-query"
import { AuthError, Session, User } from "@supabase/supabase-js"
import { jwtDecode } from "jwt-decode"
import type { JwtPayload } from "jwt-decode"

import useSupabaseBrowser from "@/utils/supabase/client"
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

const areRolesEqual = (dbRoles: RoleType[], jwtRoles: RoleType[]): boolean => {
    if (dbRoles.length !== jwtRoles.length) return false
    const sortedDbRoles = [...dbRoles].sort()
    const sortedJwtRoles = [...jwtRoles].sort()
    return sortedDbRoles.every((role, index) => role === sortedJwtRoles[index])
}

export function useUserRole() {
    const supabase = useSupabaseBrowser()

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
            const { data: user } = await supabase.auth.getUser()

            // Get JWT roles first
            const jwtRoles = decodedJwt.app_metadata.user_roles

            // Only fetch DB roles if we have a user
            if (user.user?.id) {
                const { data: dbRoles } = await supabase
                    .from("user_roles")
                    .select("role")
                    .eq("user_id", user.user.id)

                // If we have DB roles, check if they're different from JWT roles
                if (dbRoles?.length) {
                    const dbRoleTypes = dbRoles.map((r) => r.role as RoleType)

                    // Only use DB roles if they're different from JWT roles
                    const userRoles = areRolesEqual(dbRoleTypes, jwtRoles)
                        ? jwtRoles // Use JWT roles if they're the same (avoid unnecessary updates)
                        : dbRoleTypes // Use DB roles if they're different

                    return {
                        session,
                        user: user.user,
                        user_roles: userRoles,
                    }
                }
            }

            // Fallback to JWT roles if no DB roles or no difference
            return {
                session,
                user: user.user,
                user_roles: jwtRoles,
            }
        }

        return { session: null, user: null, user_roles: [] }
    }

    return useQuery<UserRoleData, AuthError>({
        queryKey: ["user-role"],
        queryFn: fetchUserRole,
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    })
}
