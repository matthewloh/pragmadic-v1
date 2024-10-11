import ProfileCard from "@/features/profile/components/ProfileCard"
import { CompleteProfile } from "@/lib/db/schema/profile"

type RegularProfileCardProps = {
    profile: CompleteProfile | undefined
    isExpanded: boolean
    onToggle: () => void
    onManage: () => void
}

export const RegularProfileCard: React.FC<RegularProfileCardProps> = ({
    profile,
    isExpanded,
    onToggle,
    onManage,
}) => {
    return (
        <ProfileCard
            profile={{
                id: "regular",
                type: "regular",
                exists: !!profile,
                title: "Digital Nomad Profile",
                description: "Manage your digital nomad information",
            }}
            isExpanded={isExpanded}
            onToggle={onToggle}
            onManage={onManage}
        />
    )
}
