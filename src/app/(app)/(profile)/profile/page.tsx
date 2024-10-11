import Loading from "@/app/loading"
import DerantauAdminProfileList from "@/components/derantauAdminProfile/DerantauAdminProfileList"
import HubOwnerProfileList from "@/components/hubOwnerProfiles/HubOwnerProfileList"
import ProfileCatalogue from "@/components/profile-catalogue"
import ProfileList from "@/components/profile/ProfileList"
import { getDerantauAdminProfiles } from "@/lib/api/derantauAdminProfile/queries"
import { getSingleHubOwnerProfile } from "@/lib/api/hubOwnerProfiles/queries"
import { getSingleProfile } from "@/lib/api/profile/queries"
import { getRegions } from "@/lib/api/regions/queries"
import { getUserRole } from "@/lib/auth/get-user-role"
import { Suspense } from "react"

export const revalidate = 0

export default async function ProfilePageWrapper() {
    return (
        <div className="container mx-auto max-w-5xl p-4">
            <Suspense fallback={<Loading />}>
                <Profile />
            </Suspense>
        </div>
    )
}

const Profile = async () => {
    const { role } = await getUserRole()
    const { profile } = await getSingleProfile()

    let hubOwnerProfileData
    let derantauAdminProfileData
    let regions

    if (role === "owner") {
        const { hubOwnerProfile } = await getSingleHubOwnerProfile()
        hubOwnerProfileData = hubOwnerProfile
    } else if (role === "admin") {
        const { derantauAdminProfile } = await getDerantauAdminProfiles()
        const regionsData = await getRegions()
        derantauAdminProfileData = derantauAdminProfile
        regions = regionsData.regions
    }

    return (
        <div className="container mx-auto space-y-8">
            <h1 className="mb-6 text-3xl font-bold">Your DE Rantau Profiles</h1>
            <ProfileCatalogue
                role={role}
                regularProfile={profile}
                hubOwnerProfile={hubOwnerProfileData}
                derantauAdminProfiles={derantauAdminProfileData}
                regions={regions}
                regionId={derantauAdminProfileData?.[0]?.regionId ?? undefined}
            />
        </div>
    )
}
