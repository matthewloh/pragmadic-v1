export enum MarkerType {
    Event = "event",
    Location = "location",
    Info = "info",
}

export interface MarkerData {
    id: number
    type: MarkerType
    longitude: number
    latitude: number
    title: string
    description: string
    object_id: string // to be retrieved from database
}
