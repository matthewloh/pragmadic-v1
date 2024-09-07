import { type VisaApplication } from "@/lib/db/schema/visaApplications"
import {
    type FinancialProof,
    type CompleteFinancialProof,
} from "@/lib/db/schema/financialProofs"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<FinancialProof>) => void

export const useOptimisticFinancialProofs = (
    financialProofs: CompleteFinancialProof[],
    visaApplications: VisaApplication[],
) => {
    const [optimisticFinancialProofs, addOptimisticFinancialProof] =
        useOptimistic(
            financialProofs,
            (
                currentState: CompleteFinancialProof[],
                action: OptimisticAction<FinancialProof>,
            ): CompleteFinancialProof[] => {
                const { data } = action

                const optimisticVisaApplication = visaApplications.find(
                    (visaApplication) =>
                        visaApplication.id === data.visaApplicationId,
                )!

                const optimisticFinancialProof = {
                    ...data,
                    visaApplication: optimisticVisaApplication,
                    id: "optimistic",
                }

                switch (action.action) {
                    case "create":
                        return currentState.length === 0
                            ? [optimisticFinancialProof]
                            : [...currentState, optimisticFinancialProof]
                    case "update":
                        return currentState.map((item) =>
                            item.id === data.id
                                ? { ...item, ...optimisticFinancialProof }
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

    return { addOptimisticFinancialProof, optimisticFinancialProofs }
}
