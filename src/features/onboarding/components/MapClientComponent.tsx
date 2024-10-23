"use client"

import { MarkerData, MarkerType } from "@/types/map"
import { useEffect, useState } from "react"
import { MapComponent } from "./MapComponent"
import { MapSidebar } from "./MapSidebar"
import { useRouter, useSearchParams } from "next/navigation"
import { MapProvider } from "react-map-gl"

const markers: MarkerData[] = [
    {
        id: 1,
        type: MarkerType.Event,
        longitude: 100.3296,
        latitude: 5.4146,
        title: "Summer Concert",
        description: "Annual music festival",
    },
    {
        id: 2,
        type: MarkerType.Location,
        longitude: 100.3327,
        latitude: 5.4164,
        title: "City Park",
        description: "Large urban park",
    },
    {
        id: 3,
        type: MarkerType.Info,
        longitude: 100.3358,
        latitude: 5.4182,
        title: "Historical Site",
        description: "18th century fort",
    },
]

export default function MapClientComponent() {
    const [activeMarker, setActiveMarker] = useState<MarkerData | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const markerId = searchParams.get("marker")
        if (markerId) {
            const marker = markers.find((m) => m.id === parseInt(markerId))
            setActiveMarker(marker || null)
        } else {
            setActiveMarker(null)
        }
    }, [searchParams])

    const handleMarkerClick = (markerId: number) => {
        const params = new URLSearchParams(searchParams)
        params.set("marker", markerId.toString())
        router.replace(`/onboarding/map?${params.toString()}`)
    }

    const handleBackToMap = () => {
        router.replace("/onboarding/map")
    }

    return (
        <MapProvider>
            <div className="relative h-screen w-full">
                <MapComponent
                    markers={markers}
                    onMarkerClick={handleMarkerClick}
                />
                <MapSidebar
                    activeMarker={activeMarker}
                    onBackToMap={handleBackToMap}
                />
            </div>
        </MapProvider>
    )
}
