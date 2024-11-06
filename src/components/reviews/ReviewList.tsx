"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Star, StarHalf, PlusIcon, MessageCircle, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"

import { cn } from "@/lib/utils"
import { type Review, CompleteReview } from "@/lib/db/schema/reviews"
import Modal from "@/components/shared/Modal"
import { type Hub, type HubId } from "@/lib/db/schema/hubs"
import { useOptimisticReviews } from "@/app/(app)/reviews/useOptimisticReviews"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ReviewForm from "./ReviewForm"
import useSupabaseBrowser from "@/utils/supabase/client"

type TOpenModal = (review?: Review) => void

export default function ReviewList({
    reviews,
    hubs,
    hubId,
}: {
    reviews: CompleteReview[]
    hubs: Hub[]
    hubId?: HubId
}) {
    const { optimisticReviews, addOptimisticReview } = useOptimisticReviews(
        reviews,
        hubs,
    )
    const [open, setOpen] = useState(false)
    const [activeReview, setActiveReview] = useState<Review | null>(null)
    const openModal = (review?: Review) => {
        setOpen(true)
        review ? setActiveReview(review) : setActiveReview(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div className="container mx-auto p-4">
            <Modal
                open={open}
                setOpen={setOpen}
                title={activeReview ? "Edit Review" : "Create Review"}
            >
                <ReviewForm
                    review={activeReview}
                    addOptimistic={addOptimisticReview}
                    openModal={openModal}
                    closeModal={closeModal}
                    hubs={hubs}
                    hubId={hubId}
                />
            </Modal>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">Reviews</h2>
                <Button onClick={() => openModal()} variant="default">
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Review
                </Button>
            </div>
            {optimisticReviews.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {optimisticReviews.map((review) => (
                        <Review
                            review={review}
                            key={review.id}
                            openModal={openModal}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

type UserReview = {
    display_name: string
    image_url: string
}

const Review = ({
    review,
    openModal,
}: {
    review: CompleteReview
    openModal: TOpenModal
}) => {
    const supabase = useSupabaseBrowser()

    const { data: user, isPending: isLoadingUser } = useQuery<UserReview>(
        supabase
            .from("users")
            .select("display_name, image_url ")
            .eq("id", review.userId)
            .limit(1)
            .single(),
    )
    const avatarFallback = user?.display_name?.slice(0, 2).toUpperCase()
    const optimistic = review.id === "optimistic"
    const deleting = review.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("reviews")
        ? pathname
        : pathname + "/reviews/"

    const renderStars = (rating: number) => {
        const stars = []
        for (let i = 0; i < 5; i++) {
            if (i < Math.floor(rating)) {
                stars.push(
                    <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />,
                )
            } else if (i === Math.floor(rating) && rating % 1 >= 0.5) {
                stars.push(
                    <StarHalf
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />,
                )
            } else {
                stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />)
            }
        }
        return stars
    }

    return (
        <Card
            className={cn(
                "transition-all hover:shadow-lg",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "border-destructive" : "",
            )}
        >
            <CardHeader className="space-y-1">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={user?.image_url} />
                            <AvatarFallback>{avatarFallback}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">
                                {user?.display_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(
                                    new Date(review.createdAt),
                                    { addSuffix: true },
                                )}
                            </p>
                        </div>
                    </div>
                    <Badge
                        variant={review.rating >= 4 ? "default" : "secondary"}
                    >
                        {review.rating.toFixed(1)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <h3 className="mb-2 font-semibold">{review.title}</h3>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                    {review.content}
                </p>
                <div className="mt-4 flex items-center space-x-1">
                    {renderStars(review.rating)}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={basePath + "/" + review.id}>Edit</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <Card className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-primary">
                No reviews yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Be the first to share your experience!
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()} size="lg">
                    <PlusIcon className="mr-2 h-4 w-4" /> Write a Review
                </Button>
            </div>
        </Card>
    )
}
