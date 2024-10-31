import {
    type NomadProfile,
    type CompleteNomadProfile,
} from "@/lib/db/schema/nomadProfile"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<NomadProfile>) => void

export const useOptimisticNomadProfile = (
    nomadProfile: CompleteNomadProfile | null,
) => {
    const [optimisticNomadProfile, addOptimisticNomadProfile] = useOptimistic(
        nomadProfile,
        (
            currentState: CompleteNomadProfile | null,
            action: OptimisticAction<NomadProfile>,
        ): CompleteNomadProfile | null => {
            const { data } = action

            const optimisticNomadProfile = {
                ...data,

                id: "optimistic",
            }

            switch (action.action) {
                case "create":
                    return currentState === null
                        ? optimisticNomadProfile
                        : { ...currentState, ...optimisticNomadProfile }
                case "update":
                    return currentState === null
                        ? optimisticNomadProfile
                        : { ...currentState, ...optimisticNomadProfile }
                case "delete":
                    return null
                default:
                    return currentState
            }
        },
    )

    return {
        addOptimisticNomadProfile,
        optimisticNomadProfile,
    }
}
