import { Suspense } from "react"

import Loading from "@/app/loading"
import ProfileList from "@/components/profile/ProfileList"
import { getSingleProfile } from "@/lib/api/profile/queries"

export const revalidate = 0

export default async function ProfilePage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">Profile</h1>
                </div>
                <Profile />
            </div>
        </main>
    )
}

const Profile = async () => {
    const { profile } = await getSingleProfile()
    return (
        <Suspense fallback={<Loading />}>
            <ProfileList profile={profile} />
        </Suspense>
    )
}
