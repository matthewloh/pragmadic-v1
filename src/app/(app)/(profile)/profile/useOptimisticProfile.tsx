import { type Profile } from "@/lib/db/schema/profile"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<Profile>) => void

export const useOptimisticProfile = (profile: Profile | undefined) => {
    const [optimisticProfile, addOptimisticProfile] = useOptimistic(
        profile,
        (
            currentState: Profile | undefined,
            action: OptimisticAction<Profile>,
        ): Profile | undefined => {
            if (!currentState && action.action !== "create") {
                return undefined
            }

            const { data } = action

            const optimisticProfile: Profile = {
                ...(currentState || {}),
                ...data,
                id: "optimistic",
            }

            switch (action.action) {
                case "create":
                    return optimisticProfile
                case "update":
                    return { ...currentState, ...optimisticProfile }
                case "delete":
                    return { ...(currentState as Profile), id: "delete" }
                default:
                    return currentState
            }
        },
    )

    return { addOptimisticProfile, optimisticProfile }
}

