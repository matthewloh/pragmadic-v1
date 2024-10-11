import ProfileCard from "@/features/profile/components/ProfileCard"
import { CompleteDerantauAdminProfile } from "@/lib/db/schema/derantauAdminProfile"

type AdminProfileCardProps = {
    profile: CompleteDerantauAdminProfile
    isExpanded: boolean
    onToggle: () => void
    onManage: () => void
}

export const AdminProfileCard: React.FC<AdminProfileCardProps> = ({
    profile,
    isExpanded,
    onToggle,
    onManage,
}) => {
    return (
        <ProfileCard
            profile={{
                id: profile.id,
                type: "admin",
                exists: true,
                title: `Admin Profile - ${profile.department}`,
                description: `${profile.position} - ${profile.adminLevel}`,
            }}
            isExpanded={isExpanded}
            onToggle={onToggle}
            onManage={onManage}
        />
    )
}
