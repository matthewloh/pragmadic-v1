"use client"

import Modal from "@/components/shared/Modal"
import { type Community, CompleteCommunity } from "@/lib/db/schema/communities"
import { useMemo, useState } from "react"

import {
    useOptimisticCommunities
} from "@/app/(app)/communities/useOptimisticCommunities"
import { Button } from "@/components/ui/button"
import { AuthSession } from "@/lib/auth/types"
import { PlusIcon } from "lucide-react"
import CommunityCard from "./CommunityCard"
import CommunityForm from "./CommunityForm"
import CommunitySearch from "./CommunitySearch"

type TOpenModal = (community?: Community) => void

export default function CommunityList({
    communities,
    session,
}: {
    communities: CompleteCommunity[]
    session: AuthSession["session"]
}) {
    const { optimisticCommunities, addOptimisticCommunity } =
        useOptimisticCommunities(communities)

    const [open, setOpen] = useState(false)
    const [activeCommunity, setActiveCommunity] = useState<Community | null>(
        null,
    )
    const [searchQuery, setSearchQuery] = useState("")

    const filteredCommunities = useMemo(() => {
        return optimisticCommunities.filter(
            (community) =>
                community.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                community.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
        )
    }, [optimisticCommunities, searchQuery])

    const openModal = (community?: Community) => {
        setOpen(true)
        community ? setActiveCommunity(community) : setActiveCommunity(null)
    }
    const closeModal = () => setOpen(false)

    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

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
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">
                    Communities
                </h1>
                <Button onClick={() => openModal()} variant={"secondary"}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create Community
                </Button>
            </div>
            <CommunitySearch onSearch={handleSearch} />
            {filteredCommunities.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCommunities.map((community) => (
                        <CommunityCard
                            key={community.id}
                            community={community}
                            addOptimistic={addOptimisticCommunity}
                            session={session}
                        />
                    ))}
                </div>
            )}
        </div>
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
