import { type Profile, type CompleteProfile } from "@/lib/db/schema/profile"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<Profile>) => void

export const useOptimisticProfile = (profile: CompleteProfile | undefined) => {
    const [optimisticProfile, addOptimisticProfile] = useOptimistic(
        profile,
        (
            currentState: CompleteProfile | undefined,
            action: OptimisticAction<Profile>,
        ): CompleteProfile | undefined => {
            const { data } = action

            const optimisticProfile = {
                ...data,
                id: "optimistic",
            }

            switch (action.action) {
                case "create":
                    return optimisticProfile as CompleteProfile
                case "update":
                    return {
                        ...currentState,
                        ...optimisticProfile,
                    } as CompleteProfile
                case "delete":
                    return undefined
                default:
                    return currentState
            }
        },
    )

    return { addOptimisticProfile, optimisticProfile }
}
