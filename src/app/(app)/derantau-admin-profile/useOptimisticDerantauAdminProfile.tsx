import { type Region } from "@/lib/db/schema/regions"
import {
    type DerantauAdminProfile,
    type CompleteDerantauAdminProfile,
} from "@/lib/db/schema/derantauAdminProfile"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (
    action: OptimisticAction<DerantauAdminProfile>,
) => void

export const useOptimisticDerantauAdminProfile = (
    derantauAdminProfile: CompleteDerantauAdminProfile | null,
    regions: Region[],
) => {
    const [optimisticDerantauAdminProfile, addOptimisticDerantauAdminProfile] =
        useOptimistic(
            derantauAdminProfile,
            (
                currentState: CompleteDerantauAdminProfile | null,
                action: OptimisticAction<DerantauAdminProfile>,
            ): CompleteDerantauAdminProfile | null => {
                const { data } = action

                const optimisticRegion = regions.find(
                    (region) => region.id === data.regionId,
                )!

                const optimisticDerantauAdminProfile = {
                    ...data,
                    region: optimisticRegion,
                    id: "optimistic",
                }

                switch (action.action) {
                    case "create":
                        return optimisticDerantauAdminProfile
                    case "update":
                        return optimisticDerantauAdminProfile
                    case "delete":
                        return null
                    default:
                        return currentState
                }
            },
        )

    return {
        addOptimisticDerantauAdminProfile,
        optimisticDerantauAdminProfile,
    }
}
