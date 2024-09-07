"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { type Hub, CompleteHub } from "@/lib/db/schema/hubs"
import Modal from "@/components/shared/Modal"
import { type State, type StateId } from "@/lib/db/schema/states"
import { useOptimisticHubs } from "@/app/(app)/hubs/useOptimisticHubs"
import { Button } from "@/components/ui/button"
import HubForm from "./HubForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (hub?: Hub) => void

export default function HubList({
    hubs,
    states,
    stateId,
}: {
    hubs: CompleteHub[]
    states: State[]
    stateId?: StateId
}) {
    const { optimisticHubs, addOptimisticHub } = useOptimisticHubs(hubs, states)
    const [open, setOpen] = useState(false)
    const [activeHub, setActiveHub] = useState<Hub | null>(null)
    const openModal = (hub?: Hub) => {
        setOpen(true)
        hub ? setActiveHub(hub) : setActiveHub(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={activeHub ? "Edit Hub" : "Create Hub"}
            >
                <HubForm
                    hub={activeHub}
                    addOptimistic={addOptimisticHub}
                    openModal={openModal}
                    closeModal={closeModal}
                    states={states}
                    stateId={stateId}
                />
            </Modal>
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    +
                </Button>
            </div>
            {optimisticHubs.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticHubs.map((hub) => (
                        <Hub hub={hub} key={hub.id} openModal={openModal} />
                    ))}
                </ul>
            )}
        </div>
    )
}

const Hub = ({
    hub,
    openModal,
}: {
    hub: CompleteHub
    openModal: TOpenModal
}) => {
    const optimistic = hub.id === "optimistic"
    const deleting = hub.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("hubs") ? pathname : pathname + "/hubs/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{hub.name}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + hub.id}>Edit</Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No hubs
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new hub.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Hubs{" "}
                </Button>
            </div>
        </div>
    )
}
