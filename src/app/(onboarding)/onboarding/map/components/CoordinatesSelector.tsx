"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import GeocoderControl from "@/features/onboarding/components/GeocoderControl"
import { MapPin } from "lucide-react"
import { useTheme } from "next-themes"
import { useCallback, useState } from "react"
import Map, {
    MapMouseEvent,
    Marker,
    MarkerDragEvent,
    NavigationControl,
    ScaleControl,
    AttributionControl,
} from "react-map-gl"

// Import Mapbox CSS
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"
import "mapbox-gl/dist/mapbox-gl.css"

interface CoordinatesSelectorProps {
    defaultLatitude?: number
    defaultLongitude?: number
    onCoordinatesChange?: (lat: number, lng: number) => void
}

export default function CoordinatesSelector({
    defaultLatitude = 5.4164,
    defaultLongitude = 100.3327,
    onCoordinatesChange,
}: CoordinatesSelectorProps) {
    const { theme } = useTheme()
    const mapboxLightStyle =
        "mapbox://styles/matthewloh/cm1w37guu00tb01pl1an725qt"
    const mapboxDarkStyle =
        "mapbox://styles/matthewloh/cm1w34g4z01db01qp4sgz027i"

    const [viewport, setViewport] = useState({
        latitude: defaultLatitude,
        longitude: defaultLongitude,
        zoom: 11,
    })

    const [marker, setMarker] = useState({
        longitude: defaultLongitude,
        latitude: defaultLatitude,
    })

    const handleMapClick = useCallback(
        (event: MapMouseEvent) => {
            const { lng, lat } = event.lngLat
            setMarker({
                longitude: lng,
                latitude: lat,
            })
            onCoordinatesChange?.(lat, lng)
        },
        [onCoordinatesChange],
    )

    const onMarkerDragEnd = useCallback(
        (event: MarkerDragEvent) => {
            const { lng, lat } = event.lngLat
            setMarker({
                longitude: lng,
                latitude: lat,
            })
            onCoordinatesChange?.(lat, lng)
        },
        [onCoordinatesChange],
    )

    const onResult = useCallback(
        (e: any) => {
            const { result } = e
            if (result.center) {
                setMarker({
                    longitude: result.center[0],
                    latitude: result.center[1],
                })
                onCoordinatesChange?.(result.center[1], result.center[0])
            }
        },
        [onCoordinatesChange],
    )

    return (
        <div className="relative flex h-[500px] w-full flex-col overflow-hidden rounded-lg border bg-card">
            <Card className="h-full w-full border-0 shadow-none">
                <Map
                    {...viewport}
                    onMove={(evt) => setViewport(evt.viewState)}
                    onClick={handleMapClick}
                    mapboxAccessToken={
                        process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
                    }
                    mapStyle={
                        theme === "dark" ? mapboxDarkStyle : mapboxLightStyle
                    }
                    projection={"globe" as any}
                    reuseMaps
                    attributionControl={false}
                    initialViewState={{
                        latitude: defaultLatitude,
                        longitude: defaultLongitude,
                        zoom: 11,
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "0.5rem",
                    }}
                >
                    {/* Main Marker */}
                    <Marker
                        longitude={marker.longitude}
                        latitude={marker.latitude}
                        draggable
                        onDragEnd={onMarkerDragEnd}
                        anchor="bottom"
                    >
                        <div className="relative z-10 animate-bounce-slow">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-10 w-10 rounded-full bg-primary shadow-lg transition-all duration-200 hover:bg-primary/90"
                            >
                                <MapPin className="h-6 w-6 text-primary-foreground" />
                            </Button>
                            <div className="absolute -bottom-1 left-1/2 h-4 w-4 -translate-x-1/2 transform">
                                <div className="h-full w-full animate-ping rounded-full bg-primary/20" />
                            </div>
                        </div>
                    </Marker>

                    {/* Controls */}
                    <div className="absolute right-4 top-4 z-10 flex flex-col gap-4">
                        <GeocoderControl
                            position="top-right"
                            mapboxAccessToken={
                                process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!
                            }
                            onResult={onResult}
                            marker={false}
                        />
                        <NavigationControl showCompass={true} />
                    </div>

                    {/* Scale and Attribution */}
                    <div className="absolute bottom-4 left-4 z-10">
                        <ScaleControl />
                    </div>
                    <AttributionControl
                        customAttribution="Map data © OpenStreetMap contributors"
                        style={{
                            background:
                                theme === "dark"
                                    ? "rgba(0, 0, 0, 0.75)"
                                    : "rgba(255, 255, 255, 0.75)",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontSize: "12px",
                        }}
                    />
                </Map>
            </Card>
        </div>
    )
}
