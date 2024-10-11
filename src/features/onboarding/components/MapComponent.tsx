"use client"

import { CardDemo } from "@/components/aceternity/ContentCard"
import { ThreeDCardDemo } from "@/components/aceternity/ThreeDCard"
import { FloatingDock, FloatingDockItem } from "@/components/floating-dock"
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
        zoom: 16,
    })
    const { current: map } = useMap()

    const handleToolbarClick = (tool: string) => {
        setActiveToolbar(activeToolbar === tool ? null : tool)
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
                console.log("Edit tool clicked")
                break
            case "measure":
                console.log("Measure tool clicked")
                break
            case "delete":
                console.log("Delete tool clicked")
                break
            case "share":
                console.log("Share tool clicked")
                break
        }
    }

    const tools: FloatingDockItem[] = [
        {
            name: "pin",
            icon: <MapPin className="h-4 w-4" />,
            href: "#",
            title: "Add Pin",
            onClick: () => handleToolbarClick("pin"),
        },
        {
            name: "home",
            icon: <Home className="h-4 w-4" />,
            href: "#",
            title: "Home",
            onClick: () => handleToolbarClick("home"),
        },
        {
            name: "edit",
            icon: <Edit className="h-4 w-4" />,
            href: "#",
            title: "Edit",
            onClick: () => handleToolbarClick("edit"),
        },
        {
            name: "measure",
            icon: <Ruler className="h-4 w-4" />,
            href: "#",
            title: "Measure",
            onClick: () => handleToolbarClick("measure"),
        },
        {
            name: "delete",
            icon: <Trash className="h-4 w-4" />,
            href: "#",
            title: "Delete",
            onClick: () => handleToolbarClick("delete"),
        },
        {
            name: "share",
            icon: <Share className="h-4 w-4" />,
            href: "#",
            title: "Share",
            onClick: () => handleToolbarClick("share"),
        },
    ]

    const [activeToolbar, setActiveToolbar] = useState<string | null>(null)

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
                <Marker
                    longitude={100.3296}
                    latitude={5.4146}
                    anchor="bottom"
                    offset={[-20, -40]}
                >
                    <Popover>
                        <PopoverTrigger asChild>
                            <CardDemo />
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
                            <CardDemo />
                        </PopoverContent>
                    </Popover>
                </Marker>
                <NavigationControl position="top-right" />
                <ScaleControl />
                {/* Toolbar */}
            </Map>
            <FloatingDock
                items={tools}
                desktopClassName="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
                mobileClassName="absolute bottom-4 right-4"
            />
        </MapProvider>
    )
}
