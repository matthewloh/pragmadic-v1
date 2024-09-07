import { type VisaApplication } from "@/lib/db/schema/visaApplications"
import {
    type WorkContractProof,
    type CompleteWorkContractProof,
} from "@/lib/db/schema/workContractProofs"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (
    action: OptimisticAction<WorkContractProof>,
) => void

export const useOptimisticWorkContractProofs = (
    workContractProofs: CompleteWorkContractProof[],
    visaApplications: VisaApplication[],
) => {
    const [optimisticWorkContractProofs, addOptimisticWorkContractProof] =
        useOptimistic(
            workContractProofs,
            (
                currentState: CompleteWorkContractProof[],
                action: OptimisticAction<WorkContractProof>,
            ): CompleteWorkContractProof[] => {
                const { data } = action

                const optimisticVisaApplication = visaApplications.find(
                    (visaApplication) =>
                        visaApplication.id === data.visaApplicationId,
                )!

                const optimisticWorkContractProof = {
                    ...data,
                    visaApplication: optimisticVisaApplication,
                    id: "optimistic",
                }

                switch (action.action) {
                    case "create":
                        return currentState.length === 0
                            ? [optimisticWorkContractProof]
                            : [...currentState, optimisticWorkContractProof]
                    case "update":
                        return currentState.map((item) =>
                            item.id === data.id
                                ? { ...item, ...optimisticWorkContractProof }
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

    return { addOptimisticWorkContractProof, optimisticWorkContractProofs }
}
