import { type CompleteProfile } from "@/lib/db/schema/profile"
import { type CompleteNomadProfile } from "@/lib/db/schema/nomadProfile"
import { type CompleteHubOwnerProfile } from "@/lib/db/schema/hubOwnerProfiles"
import { type CompleteDerantauAdminProfile } from "@/lib/db/schema/derantauAdminProfile"
import { Region, RegionId } from "../db/schema"
import { RoleType } from "../auth/get-user-role"

export type ProfileType = "regular" | "nomad" | "owner" | "admin"

export interface AdminProfilesByRegion {
    regionId: string
    regionName: string
    profiles: CompleteDerantauAdminProfile[]
}

export interface ProfileData {
    regular?: CompleteProfile
    nomad?: CompleteNomadProfile
    owner?: CompleteHubOwnerProfile
    admin?: AdminProfilesByRegion[]
}

export type OptimisticActions<T> = {
    optimisticData: T | undefined
    addOptimisticData: (data: T) => void
}

export interface ProfileFormProps<T extends keyof ProfileData> {
    profile?: ProfileData[T]
    addOptimistic: (data: ProfileData[T]) => void
    closeModal: () => void
    regions?: Region[]
    regionId?: RegionId
}

export interface ProfileCatalogueProps {
    user_roles: RoleType[]
    profiles: ProfileData
    regions?: Region[]
}
