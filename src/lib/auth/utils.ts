import { createClient } from "@/utils/supabase/server"
import { AuthSession, UserMetadata } from "./types"

// export const checkAuth = async (): Promise<AuthSession> => {
//     const supabase = createClient()
//     const {
//         data: { user },
//     } = await supabase.auth.getUser()
//     if (!user) return { session: null }
//     return {
//         session: {
//             user: {
//                 id: user.id,
//                 email: user.email!,
//                 user_metadata: user.user_metadata! as UserMetadata,
//             },
//         },
//     }
// }

export const checkAuth = async (): Promise<AuthSession> => {
    const supabase = createClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()
    if (!session) return { session: null }
    return {
        session: {
            user: {
                id: session.user.id,
                email: session.user.email!,
                user_metadata: session.user.user_metadata! as UserMetadata,
            },
        },
    }
}
