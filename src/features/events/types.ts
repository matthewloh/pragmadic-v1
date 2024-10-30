export const EVENT_TYPES = {
    NETWORKING: "networking",
    WORKSHOP: "workshop",
    SOCIAL: "social",
    COWORKING: "coworking",
    CULTURAL: "cultural",
    TECH_TALK: "tech_talk",
    COMMUNITY_MEETUP: "community_meetup",
    SKILL_SHARING: "skill_sharing",
    LOCAL_EXPERIENCE: "local_experience",
    BUSINESS_SHOWCASE: "business_showcase",
    OTHER: "other",
} as const

export type EVENT_TYPE = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES]

export const MARKER_TYPES = {
    EVENT: "event",
    HUB: "hub",
    COMMUNITY: "community",
    OTHER: "other",
} as const

export type MARKER_TYPE = (typeof MARKER_TYPES)[keyof typeof MARKER_TYPES]

export interface MapEvent {
    id: string
    type: EVENT_TYPE
    markerType: MARKER_TYPE
    title: string
    description: string
    location: {
        latitude: number
        longitude: number
        address: string
        venue?: string
    }
    datetime: {
        start: string
        end: string
        timezone: string
    }
    organizer: {
        id: string
        name: string
        type: "hub" | "community" | "admin"
    }
    capacity?: number
    attendees?: number
    tags?: string[]
    imageUrl?: string
    price?: {
        amount: number
        currency: string
        isFree: boolean
    }
    rsvpDeadline?: string
}

export interface MapHub {
    id: string
    markerType: MARKER_TYPE
    name: string
    description: string
    type: "coworking" | "cafe" | "community_space" | "business_center"
    location: {
        latitude: number
        longitude: number
        address: string
    }
    amenities: string[]
    operatingHours: {
        [key: string]: {
            open: string
            close: string
        }
    }
    pricing?: {
        currency: string
        rates: {
            daily?: number
            weekly?: number
            monthly?: number
        }
    }
    images: string[]
    contactInfo: {
        email: string
        phone?: string
        website?: string
    }
    rating?: number
    reviews?: number
}
