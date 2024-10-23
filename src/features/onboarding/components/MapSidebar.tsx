"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Image from "next/image"
import { MarkerData, MarkerType } from "@/types/map"

interface MapSidebarProps {
    activeMarker: MarkerData | null
    onBackToMap: () => void
}

export function MapSidebar({ activeMarker, onBackToMap }: MapSidebarProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const DefaultContent = () => (
        <>
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>This week</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-2 flex items-center space-x-2">
                        <Image
                            src="/placeholder.svg"
                            alt="Movie Night"
                            width={40}
                            height={40}
                            className="rounded"
                        />
                        <div>
                            <p className="font-semibold">Movie Night</p>
                            <p className="text-sm text-muted-foreground">
                                Outdoor movie night
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Button className="mb-4 w-full">
                <Plus className="mr-2 h-4 w-4" /> Add spot to section
            </Button>
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Coming up</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[
                            "Art Walk",
                            "Park Cleanup",
                            "Bike Ride",
                            "Dog Walk",
                        ].map((event, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2"
                            >
                                <Image
                                    src="/placeholder.svg"
                                    alt={event}
                                    width={40}
                                    height={40}
                                    className="rounded"
                                />
                                <div>
                                    <p className="font-semibold">{event}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Event description
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    )

    const EventContent = ({
        title,
        description,
    }: {
        title: string
        description: string
    }) => (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Image
                    src="/placeholder.svg"
                    alt={title}
                    width={320}
                    height={200}
                    className="mb-4 rounded"
                />
                <p className="mb-2">Date: June 15, 2024</p>
                <p className="mb-2">Time: 7:00 PM - 10:00 PM</p>
                <p className="mb-4">Location: Central Park</p>
                <p>{description}</p>
            </CardContent>
        </Card>
    )

    const LocationContent = ({
        title,
        description,
    }: {
        title: string
        description: string
    }) => (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Image
                    src="/placeholder.svg"
                    alt={title}
                    width={320}
                    height={200}
                    className="mb-4 rounded"
                />
                <p className="mb-2">Address: 123 Main St, Anytown, USA</p>
                <p className="mb-4">Hours: 9:00 AM - 5:00 PM</p>
                <p>{description}</p>
            </CardContent>
        </Card>
    )

    const InfoContent = ({
        title,
        description,
    }: {
        title: string
        description: string
    }) => (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">{description}</p>
                <ul className="list-disc pl-5">
                    <li>Fact 1 about {title}</li>
                    <li>Fact 2 about {title}</li>
                    <li>Fact 3 about {title}</li>
                </ul>
            </CardContent>
        </Card>
    )

    const renderContent = () => {
        if (!activeMarker) {
            return <DefaultContent />
        }

        switch (activeMarker.type) {
            case MarkerType.Event:
                return (
                    <EventContent
                        title={activeMarker.title}
                        description={activeMarker.description}
                    />
                )
            case MarkerType.Location:
                return (
                    <LocationContent
                        title={activeMarker.title}
                        description={activeMarker.description}
                    />
                )
            case MarkerType.Info:
                return (
                    <InfoContent
                        title={activeMarker.title}
                        description={activeMarker.description}
                    />
                )
            default:
                return <DefaultContent />
        }
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
                        {activeMarker && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onBackToMap}
                            >
                                Back to Map
                            </Button>
                        )}
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
