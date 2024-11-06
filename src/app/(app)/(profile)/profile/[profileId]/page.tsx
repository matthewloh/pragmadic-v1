import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getProfileById } from "@/lib/api/profile/queries"
import OptimisticProfile from "./OptimisticProfile"

import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"
import { db } from "@/lib/db"
import { users, profile as profileSchema } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

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
    const { profile: profileData } = await getProfileById(id)
    if (!profileData) notFound()

    const userImage = await db
        .select({
            image_url: users.image_url,
        })
        .from(users)
        .where(eq(users.id, profileData.userId))
        .limit(1)
        .then((rows) => rows[0]?.image_url)
    const imageFallback = `https://avatar.vercel.sh/${profileData.userId}`
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="profile" />
                <OptimisticProfile
                    profile={profileData}
                    userImageUrl={userImage || imageFallback}
                />
            </div>
        </Suspense>
    )
}
