"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { EventMarker } from "@/lib/db/schema/mapMarkers"
import { formatDate } from "@/lib/utils"
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"
import { motion } from "framer-motion"
import "mapbox-gl/dist/mapbox-gl.css"
import { useTheme } from "next-themes"
import { useCallback, useState } from "react"
import Map, { Marker, NavigationControl, ScaleControl } from "react-map-gl"
import GeocoderControl from "./GeocoderControl"
import { MarkerIcon } from "./MarkerIcon"

interface MapComponentProps {
    eventMarkers: EventMarker[]
    onMarkerClick(markerId: string): void
}

export function MapComponent({
    eventMarkers = [],
    onMarkerClick,
}: MapComponentProps) {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!
    const { theme } = useTheme()

    const mapboxLightStyle =
        "mapbox://styles/matthewloh/cm1w37guu00tb01pl1an725qt"
    const mapboxDarkStyle =
        "mapbox://styles/matthewloh/cm1w34g4z01db01qp4sgz027i"

    const [viewState, setViewState] = useState({
        longitude: 100.3327,
        latitude: 5.4164,
        zoom: 16,
    })

    const onResult = useCallback((e: any) => {
        const { result } = e
        if (result.center) {
            setViewState({
                longitude: result.center[0],
                latitude: result.center[1],
                zoom: 14,
            })
        }
    }, [])

    return (
        <div className="flex h-full w-full flex-grow flex-col">
            <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapboxAccessToken={mapboxToken}
                style={{ width: "100%", height: "100%" }}
                mapStyle={theme === "dark" ? mapboxDarkStyle : mapboxLightStyle}
                projection={"globe" as any}
                doubleClickZoom={false}
            >
                {eventMarkers.map((marker) => (
                    <Marker
                        key={marker.id}
                        longitude={Number(marker.longitude)}
                        latitude={Number(marker.latitude)}
                        anchor="bottom"
                    >
                        <Popover>
                            <PopoverTrigger asChild>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full bg-purple-500 hover:bg-purple-600"
                                    >
                                        <MarkerIcon
                                            type="event"
                                            className="h-4 w-4 animate-bounce-slow text-white"
                                        />
                                    </Button>
                                </motion.div>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-80 p-0"
                                align="center"
                                side="top"
                            >
                                <Card className="border-0">
                                    <CardHeader className="bg-purple-500 text-white">
                                        <CardTitle className="flex items-center">
                                            <MarkerIcon
                                                type="event"
                                                className="mr-2 h-5 w-5"
                                            />
                                            {marker.venue || "Event Location"}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <p>{marker.address}</p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Start:{" "}
                                            {formatDate(
                                                marker.startTime.toISOString(),
                                            )}
                                            <br />
                                            End:{" "}
                                            {formatDate(
                                                marker.endTime.toISOString(),
                                            )}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            variant="secondary"
                                            className="w-full"
                                            onClick={() =>
                                                onMarkerClick(marker.id)
                                            }
                                        >
                                            View Details
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </PopoverContent>
                        </Popover>
                    </Marker>
                ))}

                <GeocoderControl
                    mapboxAccessToken={mapboxToken}
                    position="top-right"
                    onResult={onResult}
                    marker={true}
                />
                <NavigationControl position="top-right" />
                <ScaleControl />
            </Map>
        </div>
    )
}
