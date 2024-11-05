"use client"

import RatingDistribution from "./RatingDistribution"
import HubComparison from "./HubComparison"
import TopRatedHubs from "./TopRatedHubs"
import ReviewVolume from "./ReviewVolume"
import CategoryAnalysis from "./CategoryAnalysis"

interface ReviewAnalyticsProps {
    type:
        | "rating_distribution"
        | "hub_comparison"
        | "top_rated_hubs"
        | "review_volume"
        | "category_analysis"
    data: any[]
    title?: string
}

export function ReviewAnalytics({ type, data, title }: ReviewAnalyticsProps) {
    if (!data || data.length === 0) return null

    switch (type) {
        case "rating_distribution":
            return <RatingDistribution data={data} />
        case "hub_comparison":
            return <HubComparison data={data} />
        case "top_rated_hubs":
            return <TopRatedHubs data={data} />
        case "review_volume":
            return <ReviewVolume data={data} />
        case "category_analysis":
            return <CategoryAnalysis data={data} />
        default:
            return null
    }
}
