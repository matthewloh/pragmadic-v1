"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { EventMarker } from "@/lib/db/schema/mapMarkers"
import { useRouter, useSearchParams } from "next/navigation"
import { MapProvider } from "react-map-gl"
import { MapComponent } from "./MapComponent"
import { MapSidebar } from "./MapSidebar"

export default function MapClientComponent({
    eventMarkers,
}: {
    eventMarkers: EventMarker[]
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { open } = useSidebar()

    const handleMarkerClick = (markerId: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("marker", markerId)
        params.set("type", "event")
        router.replace(`/onboarding/map?${params.toString()}`)
    }

    return (
        <MapProvider>
            <MapComponent
                eventMarkers={eventMarkers}
                onMarkerClick={handleMarkerClick}
            />
            <MapSidebar onBackToMap={() => router.replace("/onboarding/map")} />
        </MapProvider>
    )
}
