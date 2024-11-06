import { notFound } from "next/navigation"
import { Suspense } from "react"

import { getHubOwnerProfileById } from "@/lib/api/hubOwnerProfiles/queries"
import OptimisticHubOwnerProfile from "./OptimisticHubOwnerProfile"

import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"
import { users } from "@/lib/db/schema"

export const revalidate = 0

export default async function HubOwnerProfilePage(props: {
    params: Promise<{ hubOwnerProfileId: string }>
}) {
    const params = await props.params
    return (
        <main className="h-full w-full overflow-auto">
            <HubOwnerProfile id={params.hubOwnerProfileId} />
        </main>
    )
}

const HubOwnerProfile = async ({ id }: { id: string }) => {
    const { hubOwnerProfile } = await getHubOwnerProfileById(id)

    if (!hubOwnerProfile) notFound()
    const userImage = await db
        .select({
            image_url: users.image_url,
        })
        .from(users)
        .where(eq(users.id, hubOwnerProfile.userId))
        .limit(1)
        .then((rows) => rows[0]?.image_url)
    const imageFallback = `https://avatar.vercel.sh/${hubOwnerProfile.userId}`
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="hub-owner-profiles" />
                <OptimisticHubOwnerProfile
                    hubOwnerProfile={hubOwnerProfile}
                    userImageUrl={userImage || imageFallback}
                />
            </div>
        </Suspense>
    )
}
