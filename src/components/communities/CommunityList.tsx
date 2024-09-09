"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { type Community, CompleteCommunity } from "@/lib/db/schema/communities"
import Modal from "@/components/shared/Modal"

import { useOptimisticCommunities } from "@/app/(app)/communities/useOptimisticCommunities"
import { Button } from "@/components/ui/button"
import CommunityForm from "./CommunityForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (community?: Community) => void

export default function CommunityList({
    communities,
}: {
    communities: CompleteCommunity[]
}) {
    const { optimisticCommunities, addOptimisticCommunity } =
        useOptimisticCommunities(communities)
    const [open, setOpen] = useState(false)
    const [activeCommunity, setActiveCommunity] = useState<Community | null>(
        null,
    )
    const openModal = (community?: Community) => {
        setOpen(true)
        community ? setActiveCommunity(community) : setActiveCommunity(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={activeCommunity ? "Edit Community" : "Create Community"}
            >
                <CommunityForm
                    community={activeCommunity}
                    addOptimistic={addOptimisticCommunity}
                    openModal={openModal}
                    closeModal={closeModal}
                />
            </Modal>
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    +
                </Button>
            </div>
            {optimisticCommunities.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticCommunities.map((community) => (
                        <Community
                            community={community}
                            key={community.id}
                            openModal={openModal}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

const Community = ({
    community,
    openModal,
}: {
    community: CompleteCommunity
    openModal: TOpenModal
}) => {
    const optimistic = community.id === "optimistic"
    const deleting = community.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("communities")
        ? pathname
        : pathname + "/communities/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{community.name}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + community.id}>Edit</Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No communities
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new community.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Communities{" "}
                </Button>
            </div>
        </div>
    )
}
