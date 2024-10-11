import {
    type HubOwnerProfile,
    type CompleteHubOwnerProfile,
} from "@/lib/db/schema/hubOwnerProfiles"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<HubOwnerProfile>) => void

export const useOptimisticHubOwnerProfile = (
    hubOwnerProfile: CompleteHubOwnerProfile | undefined,
) => {
    const [optimisticHubOwnerProfile, addOptimisticHubOwnerProfile] =
        useOptimistic(
            hubOwnerProfile,
            (
                currentState: CompleteHubOwnerProfile | undefined,
                action: OptimisticAction<HubOwnerProfile>,
            ): CompleteHubOwnerProfile | undefined => {
                const { data } = action

                const optimisticHubOwnerProfile = {
                    ...data,
                    id: "optimistic",
                }

                switch (action.action) {
                    case "create":
                        return optimisticHubOwnerProfile as CompleteHubOwnerProfile
                    case "update":
                        return {
                            ...currentState,
                            ...optimisticHubOwnerProfile,
                        } as CompleteHubOwnerProfile
                    case "delete":
                        return undefined
                    default:
                        return currentState
                }
            },
        )

    return { addOptimisticHubOwnerProfile, optimisticHubOwnerProfile }
}
