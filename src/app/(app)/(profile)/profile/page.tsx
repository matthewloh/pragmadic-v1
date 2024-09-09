import { Suspense } from "react"

import Loading from "@/app/loading"
import ProfileList from "@/components/profile/ProfileList"
import { getSingleProfile } from "@/lib/api/profile/queries"
import { ScrollArea } from "@/components/ui/scroll-area"

export const revalidate = 0

export default async function ProfilePage() {
    return (
        <div className="flex w-full flex-1 flex-col">
            <ScrollArea className="flex-1 rounded-md">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">Profile</h1>
                </div>
                <Profile />
            </ScrollArea>
        </div>
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
