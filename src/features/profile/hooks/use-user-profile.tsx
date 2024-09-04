import { db } from "@/db"
import { profileTable } from "@/db/schema"
import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { eq } from "drizzle-orm"

export function useUserProfile() {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: async () => {
            // Fetch user profile
            const supabase = createClient()
            const {
                data: { user },
            } = await supabase.auth.getUser()
            const data = await db?.query.profileTable.findFirst({
                where: eq(profileTable.userId, user!.id),
            })
            return data
        },
    })
}
