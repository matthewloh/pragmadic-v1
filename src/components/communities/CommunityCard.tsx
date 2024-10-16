"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2Icon } from "lucide-react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    type Community,
    type CompleteCommunity,
} from "@/lib/db/schema/communities"
import { deleteCommunityAction } from "@/lib/actions/communities"
import { type TAddOptimistic } from "@/app/(app)/communities/useOptimisticCommunities"
import { type AuthSession } from "@/lib/auth/types"

export default function CommunityCard({
    community,
    addOptimistic,
    session,
}: {
    community: CompleteCommunity
    addOptimistic: TAddOptimistic
    session: AuthSession["session"]
}) {
    const router = useRouter()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startTransition] = useTransition()
    const isOwner = session?.user?.id === community.userId

    const onSuccess = (
        action: "delete",
        data?: { error: string; values: Community },
    ) => {
        const failed = Boolean(data?.error)
        if (failed) {
            toast.error(`Failed to ${action}`, {
                description: data?.error ?? "Error",
            })
        } else {
            router.refresh()
            toast.success(`Community ${action}d!`)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        setIsDeleteDialogOpen(false)
        startTransition(async () => {
            addOptimistic({ action: "delete", data: community })
            const error = await deleteCommunityAction(community.id)
            setIsDeleting(false)
            const errorFormatted = error
                ? { error, values: community }
                : undefined
            onSuccess("delete", errorFormatted)
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{community.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600">{community.description}</p>
                <div className="mt-4 flex items-center">
                    <Avatar className="h-6 w-6">
                        <AvatarImage
                            src={`https://avatar.vercel.sh/${community.id}`}
                        />
                        <AvatarFallback>
                            {community.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button asChild variant="outline">
                    <Link href={`/communities/${community.id}`}>
                        View Community
                    </Link>
                </Button>
                {isOwner && (
                    <Dialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                disabled={isDeleting || pending}
                            >
                                <Trash2Icon className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Community</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this
                                    community? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={isDeleting || pending}
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </CardFooter>
        </Card>
    )
}
