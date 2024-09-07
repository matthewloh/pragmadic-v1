import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { checkAuth } from "@/lib/auth/utils"
import { type ReviewId, reviewIdSchema, reviews } from "@/lib/db/schema/reviews"
import { hubs } from "@/lib/db/schema/hubs"

export const getReviews = async () => {
    const { session } = await checkAuth()
    const rows = await db
        .select({ review: reviews, hub: hubs })
        .from(reviews)
        .leftJoin(hubs, eq(reviews.hubId, hubs.id))
        .where(eq(reviews.userId, session?.user.id!))
    const r = rows.map((r) => ({ ...r.review, hub: r.hub }))
    return { reviews: r }
}

export const getReviewById = async (id: ReviewId) => {
    const { session } = await checkAuth()
    const { id: reviewId } = reviewIdSchema.parse({ id })
    const [row] = await db
        .select({ review: reviews, hub: hubs })
        .from(reviews)
        .where(
            and(
                eq(reviews.id, reviewId),
                eq(reviews.userId, session?.user.id!),
            ),
        )
        .leftJoin(hubs, eq(reviews.hubId, hubs.id))
    if (row === undefined) return {}
    const r = { ...row.review, hub: row.hub }
    return { review: r }
}
