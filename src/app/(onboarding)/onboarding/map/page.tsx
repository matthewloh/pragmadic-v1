import MapClientComponent from "@/features/onboarding/components/MapClientComponent"
import { createClient } from "@/utils/supabase/server"

export default async function OnboardingMapPage() {
    const supabase = await createClient()
    const { data: EventMarkerData } = await supabase
        .from("event_markers")
        .select("*")
        .order("created_at", { ascending: false })
    const eventMarkers = EventMarkerData?.map((marker) => ({
        ...marker,
        createdAt: new Date(marker.created_at),
        updatedAt: new Date(marker.updated_at),
        userId: marker.user_id,
        eventId: marker.event_id,
        eventType: marker.event_type,
        startTime: new Date(marker.start_time),
        endTime: new Date(marker.end_time),
        latitude: marker.latitude.toString(),
        longitude: marker.longitude.toString(),
    }))
    return <MapClientComponent eventMarkers={eventMarkers || []} />
}
