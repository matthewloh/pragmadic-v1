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
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarDays, Sun } from "lucide-react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useCallback, useMemo, useRef, useState } from "react"
import Map, { Marker, NavigationControl } from "react-map-gl"

export function MapComponent() {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!
    const [viewState, setViewState] = useState({
        longitude: 100.3327,
        latitude: 5.4164,
        zoom: 11,
    })

    const markerRef = useRef<mapboxgl.Marker>()
    const popup = useMemo(() => {
        return new mapboxgl.Popup().setHTML("<h1>Hello world!</h1>")
    }, [])

    const togglePopup = useCallback(() => {
        markerRef.current?.togglePopup()
    }, [])

    return (
        <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapboxAccessToken={mapboxToken}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            projection={"globe" as any}
        >
            <Marker
                longitude={100.3327}
                latitude={5.4164}
                ref={markerRef as any}
            >
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                            <CalendarDays className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="start" side="top">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Local Weather</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Sun className="mr-2 h-10 w-10 text-yellow-500" />
                                        <div>
                                            <p className="text-2xl font-bold">
                                                72°F
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Sunny
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            High: 75°F
                                        </p>
                                        <p className="text-sm font-medium">
                                            Low: 62°F
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="ghost" className="w-full">
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    7-Day Forecast
                                </Button>
                            </CardFooter>
                        </Card>
                    </PopoverContent>
                </Popover>
            </Marker>
            <NavigationControl position="top-right" />
        </Map>
    )
}
