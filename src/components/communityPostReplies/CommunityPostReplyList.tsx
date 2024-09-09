"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
    type CommunityPostReply,
    CompleteCommunityPostReply,
} from "@/lib/db/schema/communityPostReplies"
import Modal from "@/components/shared/Modal"
import {
    type CommunityPost,
    type CommunityPostId,
} from "@/lib/db/schema/communityPosts"
import { useOptimisticCommunityPostReplies } from "@/app/(app)/community-post-replies/useOptimisticCommunityPostReplies"
import { Button } from "@/components/ui/button"
import CommunityPostReplyForm from "./CommunityPostReplyForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (communityPostReply?: CommunityPostReply) => void

export default function CommunityPostReplyList({
    communityPostReplies,
    communityPosts,
    communityPostId,
}: {
    communityPostReplies: CompleteCommunityPostReply[]
    communityPosts: CommunityPost[]
    communityPostId?: CommunityPostId
}) {
    const { optimisticCommunityPostReplies, addOptimisticCommunityPostReply } =
        useOptimisticCommunityPostReplies(communityPostReplies, communityPosts)
    const [open, setOpen] = useState(false)
    const [activeCommunityPostReply, setActiveCommunityPostReply] =
        useState<CommunityPostReply | null>(null)
    const openModal = (communityPostReply?: CommunityPostReply) => {
        setOpen(true)
        communityPostReply
            ? setActiveCommunityPostReply(communityPostReply)
            : setActiveCommunityPostReply(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    activeCommunityPostReply
                        ? "Edit CommunityPostReply"
                        : "Create Community Post Reply"
                }
            >
                <CommunityPostReplyForm
                    communityPostReply={activeCommunityPostReply}
                    addOptimistic={addOptimisticCommunityPostReply}
                    openModal={openModal}
                    closeModal={closeModal}
                    communityPosts={communityPosts}
                    communityPostId={communityPostId}
                />
            </Modal>
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    +
                </Button>
            </div>
            {optimisticCommunityPostReplies.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticCommunityPostReplies.map(
                        (communityPostReply) => (
                            <CommunityPostReply
                                communityPostReply={communityPostReply}
                                key={communityPostReply.id}
                                openModal={openModal}
                            />
                        ),
                    )}
                </ul>
            )}
        </div>
    )
}

const CommunityPostReply = ({
    communityPostReply,
    openModal,
}: {
    communityPostReply: CompleteCommunityPostReply
    openModal: TOpenModal
}) => {
    const optimistic = communityPostReply.id === "optimistic"
    const deleting = communityPostReply.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("community-post-replies")
        ? pathname
        : pathname + "/community-post-replies/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{communityPostReply.content}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + communityPostReply.id}>Edit</Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No community post replies
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new community post reply.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Community Post Replies{" "}
                </Button>
            </div>
        </div>
    )
}
