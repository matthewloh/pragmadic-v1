import { SidebarTrigger } from "@/components/ui/sidebar"
import UserButtonSupabase from "@/features/auth/components/UserButtonSupabase"
import { getUser } from "@/lib/api/users/queries"

export default async function MainNavBar() {
    const { user } = await getUser()
    return (
        <div className="flex h-[60px] w-full items-center justify-between border-b">
            <div className="m-auto mr-4 flex w-full flex-row items-center justify-between">
                <div className="flex items-center">
                    <SidebarTrigger className="h-[60px]" />
                </div>
                <UserButtonSupabase user={user} />
            </div>
        </div>
    )
}
