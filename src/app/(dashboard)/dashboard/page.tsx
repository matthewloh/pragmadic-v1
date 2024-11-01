import { AutumnFireGradient } from "@/components/gradients"
import { getUserAuth } from "@/lib/auth/utils"
import { outfit } from "@/utils/fonts"
import { redirect } from "next/navigation"
import DashboardSwitcher from "@/features/dashboard/components/DashboardSwitcher"
import { getUser } from "@/lib/api/users/queries"

export default async function DashboardPage() {
    const { session } = await getUserAuth()

    if (!session) {
        redirect("/login")
    }

    const userRoles = session.roles
    const { user } = await getUser()
    if (!user) {
        redirect("/login")
    }

    return (
        <div
            className={`relative min-h-screen w-full overflow-hidden bg-background text-foreground ${outfit.className}`}
        >
            <AutumnFireGradient />
            <div className="relative z-10">
                <DashboardSwitcher
                    user={user}
                    userRoles={userRoles}
                    defaultRole={userRoles[0]}
                />
            </div>
        </div>
    )
}
