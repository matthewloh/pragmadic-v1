import ProfileCard from "@/features/profile/components/ProfileCard"
import { CompleteHubOwnerProfile } from "@/lib/db/schema/hubOwnerProfiles"

type HubOwnerProfileCardProps = {
    profile: CompleteHubOwnerProfile | undefined
    isExpanded: boolean
    onToggle: () => void
    onManage: () => void
}

export const HubOwnerProfileCard: React.FC<HubOwnerProfileCardProps> = ({
    profile,
    isExpanded,
    onToggle,
    onManage,
}) => {
    return (
        <ProfileCard
            profile={{
                id: "owner",
                type: "owner",
                exists: !!profile,
                title: "Hub Owner Profile",
                description: "Manage your DE Rantau Hub details",
            }}
            isExpanded={isExpanded}
            onToggle={onToggle}
            onManage={onManage}
        />
    )
}
