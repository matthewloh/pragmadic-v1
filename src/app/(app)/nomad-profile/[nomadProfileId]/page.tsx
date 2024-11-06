import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getNomadProfileById } from "@/lib/api/nomadProfile/queries"
import OptimisticNomadProfile from "./OptimisticNomadProfile"
import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"
import { users } from "@/lib/db/schema"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"

export const revalidate = 0

export default async function NomadProfilePage(props: {
    params: Promise<{ nomadProfileId: string }>
}) {
    const params = await props.params
    return (
        <main className="container mx-auto h-full w-full overflow-auto">
            <NomadProfile id={params.nomadProfileId} />
        </main>
    )
}

const NomadProfile = async ({ id }: { id: string }) => {
    const { nomadProfile } = await getNomadProfileById(id)
    if (!nomadProfile) notFound()

    const userImage = await db
        .select({
            image_url: users.image_url,
        })
        .from(users)
        .where(eq(users.id, nomadProfile.userId))
        .limit(1)
        .then((rows) => rows[0]?.image_url)
    const imageFallback = `https://avatar.vercel.sh/${nomadProfile.userId}`
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="nomad-profile" />
                <OptimisticNomadProfile
                    nomadProfile={nomadProfile}
                    userImageUrl={userImage || imageFallback}
                />
            </div>
        </Suspense>
    )
}
