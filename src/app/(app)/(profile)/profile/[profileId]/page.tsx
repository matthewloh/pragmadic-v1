import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getProfileById } from "@/lib/api/profile/queries"
import OptimisticProfile from "./OptimisticProfile"

import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"

export const revalidate = 0

export default async function ProfilePage(props: {
    params: Promise<{ profileId: string }>
}) {
    const params = await props.params
    return (
        <main className="h-full w-full overflow-auto">
            <Profile id={params.profileId} />
        </main>
    )
}

const Profile = async ({ id }: { id: string }) => {
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
