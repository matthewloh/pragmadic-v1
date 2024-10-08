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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    CalendarDays,
    Edit,
    Home,
    MapPin,
    Ruler,
    Share,
    Sun,
    Trash,
} from "lucide-react"
import "mapbox-gl/dist/mapbox-gl.css"
import { useState } from "react"
import Map, {
    MapProvider,
    Marker,
    NavigationControl,
    ScaleControl,
    useMap,
} from "react-map-gl"

export function MapComponent() {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!
    const [viewState, setViewState] = useState({
        longitude: 100.3327,
        latitude: 5.4164,
        zoom: 11,
    })
    const { current: map } = useMap()

    const tools = [
        { name: "pin", icon: MapPin, tooltip: "Add Pin" },
        { name: "home", icon: Home, tooltip: "Home" },
        { name: "edit", icon: Edit, tooltip: "Edit" },
        { name: "measure", icon: Ruler, tooltip: "Measure" },
        { name: "delete", icon: Trash, tooltip: "Delete" },
        { name: "share", icon: Share, tooltip: "Share" },
    ]

    const [activeToolbar, setActiveToolbar] = useState<string | null>(null)

    const handleToolbarClick = (tool: string) => {
        setActiveToolbar(activeToolbar === tool ? null : tool)
        // Here you would implement the logic for each tool
        switch (tool) {
            case "pin":
                map?.flyTo({ center: [100.3296, 5.4146] })
                break
            case "home":
                setViewState({
                    ...viewState,
                    longitude: 100.3327,
                    latitude: 5.4164,
                    zoom: 15,
                })
                break
            case "edit":
                break
            case "measure":
                break
            case "delete":
                break
            case "share":
                break
        }
    }
    return (
        <MapProvider>
            <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapboxAccessToken={mapboxToken}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/matthewloh/cm1w37guu00tb01pl1an725qt"
                projection={"globe" as any}
                doubleClickZoom={false}
            >
                <Marker longitude={100.3296} latitude={5.4146} anchor="top">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-16"
                            >
                                <CalendarDays className="size-8" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-80"
                            align="center"
                            side="top"
                        >
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
                <ScaleControl />
                {/* Toolbar */}
            </Map>
            <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform rounded-full bg-white p-2 shadow-lg">
                <div className="flex space-x-2 rounded-full bg-white p-2 shadow-lg">
                    {tools.map((tool) => (
                        <Tooltip key={tool.name}>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant={
                                        activeToolbar === tool.name
                                            ? "default"
                                            : "ghost"
                                    }
                                    onClick={() =>
                                        handleToolbarClick(tool.name)
                                    }
                                >
                                    <tool.icon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tool.tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </div>
        </MapProvider>
    )
}
