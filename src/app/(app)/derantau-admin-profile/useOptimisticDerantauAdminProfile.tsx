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

export const useOptimisticDerantauAdminProfiles = (
    derantauAdminProfile: CompleteDerantauAdminProfile[],
    regions: Region[],
) => {
    const [optimisticDerantauAdminProfiles, addOptimisticDerantauAdminProfile] =
        useOptimistic(
            derantauAdminProfile,
            (
                currentState: CompleteDerantauAdminProfile[],
                action: OptimisticAction<DerantauAdminProfile>,
            ): CompleteDerantauAdminProfile[] => {
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
                        return currentState.length === 0
                            ? [optimisticDerantauAdminProfile]
                            : [...currentState, optimisticDerantauAdminProfile]
                    case "update":
                        return currentState.map((item) =>
                            item.id === data.id
                                ? { ...item, ...optimisticDerantauAdminProfile }
                                : item,
                        )
                    case "delete":
                        return currentState.map((item) =>
                            item.id === data.id
                                ? { ...item, id: "delete" }
                                : item,
                        )
                    default:
                        return currentState
                }
            },
        )

    return {
        addOptimisticDerantauAdminProfile,
        optimisticDerantauAdminProfiles,
    }
}
