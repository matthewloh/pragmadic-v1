"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { type HubMarker } from "@/lib/db/schema/mapMarkers"

interface MarkerCardProps {
    data: HubMarker
    onClose: () => void
}

export default function MarkerCard({ data, onClose }: MarkerCardProps) {
    const router = useRouter()

    const handleViewDetails = () => {
        router.push(`/hubs/${data.hubId}`)
    }

    return (
        <Card className="w-[350px] shadow-lg">
            {data.amenities && (
                <div className="relative h-[200px] w-full">
                    <Image
                        src="/placeholder-hub.jpg" // Add a default hub image
                        alt={data.venue || "Hub"}
                        fill
                        className="rounded-t-lg object-cover"
                    />
                </div>
            )}

            <CardHeader>
                <CardTitle className="text-lg">{data.venue || ""}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{data.address}</span>
                </div>

                {data.operatingHours && (
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                            {Object.entries(data.operatingHours)
                                .map(
                                    ([day, hours]) =>
                                        `${day}: ${hours.open} - ${hours.close}`,
                                )
                                .join(", ")}
                        </span>
                    </div>
                )}

                {data.amenities && data.amenities.length > 0 && (
                    <div className="mt-2">
                        <h4 className="mb-1 text-sm font-medium">Amenities</h4>
                        <div className="flex flex-wrap gap-1">
                            {data.amenities.map((amenity) => (
                                <span
                                    key={amenity}
                                    className="rounded-full bg-primary/10 px-2 py-1 text-xs"
                                >
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
                <Button onClick={handleViewDetails}>View Details</Button>
            </CardFooter>
        </Card>
    )
}
