"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function MapSidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return (
        <motion.div
            className="absolute left-8 top-4 z-10 rounded-md bg-white shadow-lg"
            initial={{ width: 0 }}
            animate={{
                width: sidebarOpen ? 360 : 0,
                height: "calc(80vh - 4rem)",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <motion.div className="absolute -right-10 top-4 z-20 flex h-full items-center">
                <Button
                    onClick={toggleSidebar}
                    variant="outline"
                    size="icon"
                    className="bg-white"
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
                        <h2 className="text-xl font-bold">
                            Copy of Event Calendar
                        </h2>
                    </div>
                    <Input
                        type="text"
                        placeholder="Search this map"
                        className="mb-4"
                    />
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle>This week</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-2 flex items-center space-x-2">
                                <Image
                                    src="/placeholder.svg?height=40&width=40"
                                    alt="Movie Night"
                                    width={40}
                                    height={40}
                                    className="rounded"
                                />
                                <div>
                                    <p className="font-semibold">Movie Night</p>
                                    <p className="text-sm text-gray-600">
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
                                            src="/placeholder.svg?height=40&width=40"
                                            alt={event}
                                            width={40}
                                            height={40}
                                            className="rounded"
                                        />
                                        <div>
                                            <p className="font-semibold">
                                                {event}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Event description
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </ScrollArea>
        </motion.div>
    )
}
