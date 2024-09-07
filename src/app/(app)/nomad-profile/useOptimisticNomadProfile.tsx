import {
    type NomadProfile,
    type CompleteNomadProfile,
} from "@/lib/db/schema/nomadProfile"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<NomadProfile>) => void

export const useOptimisticNomadProfiles = (
    nomadProfile: CompleteNomadProfile[],
) => {
    const [optimisticNomadProfiles, addOptimisticNomadProfile] = useOptimistic(
        nomadProfile,
        (
            currentState: CompleteNomadProfile[],
            action: OptimisticAction<NomadProfile>,
        ): CompleteNomadProfile[] => {
            const { data } = action

            const optimisticNomadProfile = {
                ...data,

                id: "optimistic",
            }

            switch (action.action) {
                case "create":
                    return currentState.length === 0
                        ? [optimisticNomadProfile]
                        : [...currentState, optimisticNomadProfile]
                case "update":
                    return currentState.map((item) =>
                        item.id === data.id
                            ? { ...item, ...optimisticNomadProfile }
                            : item,
                    )
                case "delete":
                    return currentState.map((item) =>
                        item.id === data.id ? { ...item, id: "delete" } : item,
                    )
                default:
                    return currentState
            }
        },
    )

    return { addOptimisticNomadProfile, optimisticNomadProfiles }
}
