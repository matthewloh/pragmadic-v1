import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getProfileById } from "@/lib/api/profile/queries"
import OptimisticProfile from "./OptimisticProfile"
import { checkAuth } from "@/lib/auth/utils"

import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"

export const revalidate = 0

export default async function ProfilePage({
    params,
}: {
    params: { profileId: string }
}) {
    return (
        <main className="overflow-auto">
            <Profile id={params.profileId} />
        </main>
    )
}

const Profile = async ({ id }: { id: string }) => {
    await checkAuth()

    const { profile } = await getProfileById(id)

    if (!profile) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="profile" />
                <OptimisticProfile profile={profile} />
            </div>
        </Suspense>
    )
}
