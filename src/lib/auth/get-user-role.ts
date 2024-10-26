import "server-only"

import { JWTPayload, jwtVerify } from "jose"

import { createClient } from "@/utils/supabase/server"
import { ROLES } from "@/utils/supabase/permissions"

export type RoleType = (typeof ROLES)[keyof typeof ROLES]

// Extend the JWTPayload type to include Supabase-specific metadata

type SupabaseJwtPayload = JWTPayload & {
    app_metadata: {
        user_roles: RoleType[]
    }
}

export async function getUserRole() {
    // Create a Supabase client for server-side operations
    const supabase = await createClient()

    // Retrieve the current session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    let user_roles

    if (session) {
        // Extract the access token from the session
        const token = session.access_token

        try {
            // Encode the JWT secret for verification
            const secret = new TextEncoder().encode(
                process.env.SUPABASE_JWT_SECRET,
            )

            // Verify the JWT token and extract the payload
            const { payload } = await jwtVerify<SupabaseJwtPayload>(
                token,
                secret,
            )

            // Extract the role from the app_metadata in the payload
            user_roles = payload.app_metadata.user_roles
        } catch (error) {
            console.error("Failed to verify token:", error)
        }
    }

    return { session, user_roles: user_roles as RoleType[] }
}

// Helper function to check if the user has a specific role
export function hasRole(userRoles: RoleType[], requiredRole: RoleType) {
    return userRoles.includes(requiredRole)
}
