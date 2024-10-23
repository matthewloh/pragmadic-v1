"use client"

import { useState, useEffect } from "react"
import Map, { Marker, NavigationControl, ScaleControl } from "react-map-gl"
import { motion } from "framer-motion"
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
import { MarkerIcon } from "./MarkerIcon"
import { MarkerData, MarkerType } from "@/types/map"
import { useTheme } from "next-themes"
import "mapbox-gl/dist/mapbox-gl.css"

interface MapComponentProps {
    markers: MarkerData[]
    onMarkerClick: (markerId: number) => void
}

export function MapComponent({
    markers = [],
    onMarkerClick,
}: MapComponentProps) {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!
    const mapboxLightStyle =
        "mapbox://styles/matthewloh/cm1w37guu00tb01pl1an725qt"
    const mapboxDarkStyle =
        "mapbox://styles/matthewloh/cm1w34g4z01db01qp4sgz027i"
    const [viewState, setViewState] = useState({
        longitude: 100.3327,
        latitude: 5.4164,
        zoom: 16,
    })
    const { theme } = useTheme()
    const [mapLoaded, setMapLoaded] = useState(false)

    useEffect(() => {
        if (mapLoaded) {
            console.log("Map loaded, markers:", markers)
        }
    }, [mapLoaded, markers])

    const getMarkerColor = (type: MarkerType) => {
        switch (type) {
            case MarkerType.Event:
                return "bg-purple-500 hover:bg-purple-600"
            case MarkerType.Location:
                return "bg-blue-500 hover:bg-blue-600"
            case MarkerType.Info:
                return "bg-green-500 hover:bg-green-600"
            default:
                return "bg-gray-500 hover:bg-gray-600"
        }
    }

    return (
        <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapboxAccessToken={mapboxToken}
            style={{ width: "100%", height: "100%" }}
            mapStyle={theme === "dark" ? mapboxDarkStyle : mapboxLightStyle}
            projection={"globe" as any}
            doubleClickZoom={false}
            onLoad={() => setMapLoaded(true)}
        >
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    longitude={marker.longitude}
                    latitude={marker.latitude}
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
                                    className={`rounded-full ${getMarkerColor(marker.type)}`}
                                >
                                    <MarkerIcon
                                        type={marker.type}
                                        className="h-4 w-4 text-white"
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
                                <CardHeader
                                    className={`text-white ${getMarkerColor(marker.type)}`}
                                >
                                    <CardTitle className="flex items-center">
                                        <MarkerIcon
                                            type={marker.type}
                                            className="mr-2 h-5 w-5"
                                        />
                                        {marker.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p>{marker.description}</p>
                                    {marker.type === MarkerType.Event && (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Date: June 15, 2024 • Time: 7:00 PM
                                        </p>
                                    )}
                                    {marker.type === MarkerType.Location && (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Open: 9:00 AM - 5:00 PM
                                        </p>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => onMarkerClick(marker.id)}
                                    >
                                        View Details
                                    </Button>
                                </CardFooter>
                            </Card>
                        </PopoverContent>
                    </Popover>
                </Marker>
            ))}
            <NavigationControl position="top-right" />
            <ScaleControl />
        </Map>
    )
}
