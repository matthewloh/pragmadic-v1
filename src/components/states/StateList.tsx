"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { type State, CompleteState } from "@/lib/db/schema/states"
import Modal from "@/components/shared/Modal"
import { type Region, type RegionId } from "@/lib/db/schema/regions"
import { useOptimisticStates } from "@/app/(app)/states/useOptimisticStates"
import { Button } from "@/components/ui/button"
import StateForm from "./StateForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (state?: State) => void

export default function StateList({
    states,
    regions,
    regionId,
}: {
    states: CompleteState[]
    regions: Region[]
    regionId?: RegionId
}) {
    const { optimisticStates, addOptimisticState } = useOptimisticStates(
        states,
        regions,
    )
    const [open, setOpen] = useState(false)
    const [activeState, setActiveState] = useState<State | null>(null)
    const openModal = (state?: State) => {
        setOpen(true)
        state ? setActiveState(state) : setActiveState(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={activeState ? "Edit State" : "Create State"}
            >
                <StateForm
                    state={activeState}
                    addOptimistic={addOptimisticState}
                    openModal={openModal}
                    closeModal={closeModal}
                    regions={regions}
                    regionId={regionId}
                />
            </Modal>
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    +
                </Button>
            </div>
            {optimisticStates.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticStates.map((state) => (
                        <State
                            state={state}
                            key={state.id}
                            openModal={openModal}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

const State = ({
    state,
    openModal,
}: {
    state: CompleteState
    openModal: TOpenModal
}) => {
    const optimistic = state.id === "optimistic"
    const deleting = state.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("states")
        ? pathname
        : pathname + "/states/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{state.name}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + state.id}>Edit</Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No states
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new state.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New States{" "}
                </Button>
            </div>
        </div>
    )
}
