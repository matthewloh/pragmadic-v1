export interface ReviewData {
    rating: number
    count: number
}

export interface HubComparisonData {
    hub: string
    rating: number
    reviews: number
}

export interface TopRatedHubData {
    name: string
    rating: number
    reviews: number
}

export interface ReviewVolumeData {
    hub: string
    count: number
    rating: number
}

export interface CategoryAnalysisData {
    category: string
    rating: number
    count: number
}
