import { type VisaApplication } from "@/lib/db/schema/visaApplications"
import {
    type HealthClearanceInfo,
    type CompleteHealthClearanceInfo,
} from "@/lib/db/schema/healthClearanceInfo"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (
    action: OptimisticAction<HealthClearanceInfo>,
) => void

export const useOptimisticHealthClearanceInfos = (
    healthClearanceInfo: CompleteHealthClearanceInfo[],
    visaApplications: VisaApplication[],
) => {
    const [optimisticHealthClearanceInfos, addOptimisticHealthClearanceInfo] =
        useOptimistic(
            healthClearanceInfo,
            (
                currentState: CompleteHealthClearanceInfo[],
                action: OptimisticAction<HealthClearanceInfo>,
            ): CompleteHealthClearanceInfo[] => {
                const { data } = action

                const optimisticVisaApplication = visaApplications.find(
                    (visaApplication) =>
                        visaApplication.id === data.visaApplicationId,
                )!

                const optimisticHealthClearanceInfo = {
                    ...data,
                    visaApplication: optimisticVisaApplication,
                    id: "optimistic",
                }

                switch (action.action) {
                    case "create":
                        return currentState.length === 0
                            ? [optimisticHealthClearanceInfo]
                            : [...currentState, optimisticHealthClearanceInfo]
                    case "update":
                        return currentState.map((item) =>
                            item.id === data.id
                                ? { ...item, ...optimisticHealthClearanceInfo }
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

    return { addOptimisticHealthClearanceInfo, optimisticHealthClearanceInfos }
}
