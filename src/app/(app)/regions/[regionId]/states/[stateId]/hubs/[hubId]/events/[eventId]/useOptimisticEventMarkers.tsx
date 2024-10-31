import { type EventMarker } from "@/lib/db/schema/mapMarkers"
import { type OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<EventMarker>) => void

export const useOptimisticEventMarkers = (eventMarkers: EventMarker[]) => {
    const [optimisticEventMarkers, addOptimisticEventMarker] = useOptimistic(
        eventMarkers,
        (
            currentState: EventMarker[],
            action: OptimisticAction<EventMarker>,
        ): EventMarker[] => {
            const { data } = action

            const optimisticMarker = {
                ...data,
                id: action.action === "create" ? "optimistic" : data.id,
            }

            switch (action.action) {
                case "create":
                    return currentState.length === 0
                        ? [optimisticMarker]
                        : [...currentState, optimisticMarker]
                case "update":
                    return currentState.map((item) =>
                        item.id === data.id
                            ? { ...item, ...optimisticMarker }
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

    return {
        optimisticEventMarkers,
        addOptimisticEventMarker,
    }
}

// For single marker optimization
export const useOptimisticEventMarker = (eventMarker: EventMarker | null) => {
    const [optimisticEventMarker, addOptimisticEventMarker] = useOptimistic(
        eventMarker,
        (
            currentState: EventMarker | null,
            action: OptimisticAction<EventMarker>,
        ): EventMarker | null => {
            const { data } = action

            const optimisticMarker = {
                ...data,
                id: action.action === "create" ? "optimistic" : data.id,
            }

            switch (action.action) {
                case "create":
                    return optimisticMarker
                case "update":
                    return currentState?.id === data.id
                        ? { ...currentState, ...optimisticMarker }
                        : currentState
                case "delete":
                    return currentState?.id === data.id
                        ? { ...currentState, id: "delete" }
                        : currentState
                default:
                    return currentState
            }
        },
    )

    return {
        optimisticEventMarker,
        addOptimisticEventMarker,
    }
}
