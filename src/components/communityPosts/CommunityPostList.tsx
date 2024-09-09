"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
    type CommunityPost,
    CompleteCommunityPost,
} from "@/lib/db/schema/communityPosts"
import Modal from "@/components/shared/Modal"
import { type Community, type CommunityId } from "@/lib/db/schema/communities"
import { useOptimisticCommunityPosts } from "@/app/(app)/community-posts/useOptimisticCommunityPosts"
import { Button } from "@/components/ui/button"
import CommunityPostForm from "./CommunityPostForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (communityPost?: CommunityPost) => void

export default function CommunityPostList({
    communityPosts,
    communities,
    communityId,
}: {
    communityPosts: CompleteCommunityPost[]
    communities: Community[]
    communityId?: CommunityId
}) {
    const { optimisticCommunityPosts, addOptimisticCommunityPost } =
        useOptimisticCommunityPosts(communityPosts, communities)
    const [open, setOpen] = useState(false)
    const [activeCommunityPost, setActiveCommunityPost] =
        useState<CommunityPost | null>(null)
    const openModal = (communityPost?: CommunityPost) => {
        setOpen(true)
        communityPost
            ? setActiveCommunityPost(communityPost)
            : setActiveCommunityPost(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    activeCommunityPost
                        ? "Edit CommunityPost"
                        : "Create Community Post"
                }
            >
                <CommunityPostForm
                    communityPost={activeCommunityPost}
                    addOptimistic={addOptimisticCommunityPost}
                    openModal={openModal}
                    closeModal={closeModal}
                    communities={communities}
                    communityId={communityId}
                />
            </Modal>
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    +
                </Button>
            </div>
            {optimisticCommunityPosts.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticCommunityPosts.map((communityPost) => (
                        <CommunityPost
                            communityPost={communityPost}
                            key={communityPost.id}
                            openModal={openModal}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

const CommunityPost = ({
    communityPost,
    openModal,
}: {
    communityPost: CompleteCommunityPost
    openModal: TOpenModal
}) => {
    const optimistic = communityPost.id === "optimistic"
    const deleting = communityPost.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("community-posts")
        ? pathname
        : pathname + "/community-posts/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{communityPost.title}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + communityPost.id}>Edit</Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No community posts
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new community post.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Community Posts{" "}
                </Button>
            </div>
        </div>
    )
}
