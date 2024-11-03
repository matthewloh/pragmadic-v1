import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { getUserAuth } from "@/lib/auth/utils"
import { users } from "@/lib/db/schema/users"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { GetStartedForm } from "@/features/getting-started/components/GetStartedForm"
import { RoleSelector } from "@/features/getting-started/components/RoleSelector"
import { GettingStartedNomadProfileForm } from "@/features/getting-started/components/NomadProfileForm"
import { GettingStartedOwnerProfileForm } from "@/features/getting-started/components/HubOwnerProfileForm"
import { LoadingPage } from "@/components/shared/loading"

export default async function GettingStartedPage(props: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const searchParams = await props.searchParams
    const { session } = await getUserAuth()

    if (!session) {
        return redirect("/auth")
    }

    // Get user profile
    const userProfile = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    })

    if (!userProfile) {
        notFound()
    }
    // If user has no display name, show initial profile setup
    if (userProfile?.display_name === "[redacted]" || !userProfile?.image_url) {
        return (
            <div className="container max-w-3xl py-8">
                <GetStartedForm user={userProfile} />
            </div>
        )
    }

    // If user hasn't selected a role, show role selector
    if (!searchParams.nomad && !searchParams.owner) {
        return (
            <div className="container max-w-3xl py-8">
                <RoleSelector />
            </div>
        )
    }

    // Show role-specific profile form
    return (
        <Suspense fallback={<LoadingPage />}>
            <div className="container max-w-3xl py-8">
                {searchParams.nomad ? (
                    <GettingStartedNomadProfileForm userId={session.user.id} />
                ) : (
                    <GettingStartedOwnerProfileForm userId={session.user.id} />
                )}
            </div>
        </Suspense>
    )
}
