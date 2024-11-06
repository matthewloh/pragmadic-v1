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

import { type Hub } from "@/lib/db/schema/hubs"
import { type Event } from "@/lib/db/schema/events"
import { type UsersToHub } from "@/lib/db/schema/hubs"
import { type UsersToEvents } from "@/lib/db/schema/events"

export type HubAnalytics = {
    id: string
    name: string
    description: string | null
    type_of_hub: string
    public: boolean
    info: string | null
    created_at: string
    updated_at: string
    hub_events: Array<{
        id: string
        name: string
        description: string
        type_of_event: string
        start_date: string
        end_date: string
        is_complete: boolean
        info: string | null
        created_at: string
        updated_at: string
        hub_id: string
        user_id: string
        users_to_events: Array<{
            user_id: string
            event_id: string
            pending: boolean
            member: boolean
            created_at: string
            updated_at: string
            users: {
                display_name: string | null
                email: string
                image_url: string | null
            }
        }>
    }>
    users_to_hubs: Array<{
        user_id: string
        hub_id: string
        invite_status: "pending" | "accepted" | "rejected"
        invite_role_type: "admin" | "member"
        created_at: string
        updated_at: string
        users: {
            display_name: string | null
            email: string
            image_url: string | null
            profile: {
                bio: string | null
                occupation: string | null
                location: string | null
            } | null
        }
    }>
}
