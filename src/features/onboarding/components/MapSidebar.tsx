"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EventMarker } from "@/lib/db/schema"
import { formatDate } from "@/lib/utils"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { motion } from "framer-motion"
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

type EventMarkerWithEvent = EventMarker & {
    event: {
        id: string | null
        name: string | null
        description: string | null
        type_of_event: string | null
        start_date: string | null
        end_date: string | null
        info: string | null
        hub_id: string | null
        user_id: string | null
    } | null
}

interface MapSidebarProps {
    onBackToMap: () => void
}

export function MapSidebar({ onBackToMap }: MapSidebarProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const supabase = useSupabaseBrowser()
    const searchParams = useSearchParams()
    const markerId = searchParams.get("marker")
    const type = searchParams.get("type")
    const {
        data: eventDetails,
        error: eventError,
        isLoading: eventLoading,
    } = useQuery<EventMarkerWithEvent>(
        supabase
            .from("event_markers")
            .select(
                `
                *,
                event:hub_events (
                    id,
                    name,
                    description,
                    type_of_event,
                    start_date,
                    end_date,
                    info,
                    hub_id,
                    user_id
                )
            `,
            )
            .eq("id", markerId || "")
            .single(),
    )
    console.log(eventDetails)
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const DefaultContent = () => (
        <>
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Nearby Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Click on a marker to view event details
                    </p>
                </CardContent>
            </Card>
        </>
    )

    const EventContent = ({ marker }: { marker: EventMarkerWithEvent }) => {
        if (!marker) return null

        return (
            <Card>
                <CardHeader>
                    <CardTitle>{marker.event?.name || marker.venue}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                        <Image
                            src="/placeholder.svg"
                            alt={marker.event?.name || "Event"}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {formatDate(marker.event?.start_date || "")}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                                {marker.event?.start_date &&
                                    new Date(
                                        marker.event.start_date,
                                    ).toLocaleTimeString()}{" "}
                                -{" "}
                                {marker.event?.end_date &&
                                    new Date(
                                        marker.event.end_date,
                                    ).toLocaleTimeString()}
                            </span>
                        </div>

                        <div className="flex items-start gap-2 text-muted-foreground">
                            <MapPin className="mt-1 h-4 w-4" />
                            <span>{marker.address}</span>
                        </div>
                    </div>

                    {marker.event?.description && (
                        <p className="text-sm">{marker.event.description}</p>
                    )}

                    <div className="flex gap-2">
                        <Button className="w-full" variant={"link"} asChild>
                            <Link
                                href={`/hubs/${marker.event?.hub_id}/events/${marker.event?.id}`}
                            >
                                Join Event
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full">
                            Share
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const renderContent = () => {
        if (!markerId || !eventDetails) {
            return <DefaultContent />
        }
        return <EventContent marker={eventDetails} />
    }

    return (
        <motion.div
            className="absolute left-4 top-4 z-10 rounded-md bg-background shadow-lg"
            initial={{ width: 0 }}
            animate={{
                width: sidebarOpen ? 360 : 0,
                height: "calc(100vh - 2rem)",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <motion.div className="absolute -right-10 top-4 z-20 flex h-full items-center">
                <Button
                    onClick={toggleSidebar}
                    variant="outline"
                    size="icon"
                    className="bg-background"
                >
                    {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                </Button>
            </motion.div>
            <ScrollArea className="h-full p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: sidebarOpen ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: sidebarOpen ? 0.2 : 0 }}
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Map Explorer</h2>
                        <Button variant="ghost" size="sm" onClick={onBackToMap}>
                            Back to Map
                        </Button>
                    </div>
                    <Input
                        type="text"
                        placeholder="Search this map"
                        className="mb-4"
                    />
                    {renderContent()}
                </motion.div>
            </ScrollArea>
        </motion.div>
    )
}
