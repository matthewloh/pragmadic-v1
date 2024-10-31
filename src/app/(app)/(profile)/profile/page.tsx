import Loading from "@/app/loading"
import ProfileList from "@/components/profile/ProfileList"
import { getSingleProfile } from "@/lib/api/profile/queries"
import { Suspense } from "react"

export const revalidate = 0

export default async function ProfilePage() {
    return (
        <main className="h-full w-full p-4">
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">Profile</h1>
                </div>
                <Suspense fallback={<Loading />}>
                    <ProfileManager />
                </Suspense>
            </div>
        </main>
    )
}

const ProfileManager = async () => {
    const { profile } = await getSingleProfile()

    return <ProfileList profile={profile} />
}
