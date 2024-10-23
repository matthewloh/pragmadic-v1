import { Marker } from "react-map-gl"
import { Calendar } from "lucide-react"

interface EventMarkerProps {
    longitude: number
    latitude: number
    onClick: () => void
    title: string
}

export function EventMarker({ longitude, latitude, onClick, title }: EventMarkerProps) {
    return (
        <Marker longitude={longitude} latitude={latitude} anchor="bottom">
            <div onClick={onClick} className="cursor-pointer">
                <Calendar className="h-8 w-8 text-red-500" />
                <div className="text-xs font-bold">{title}</div>
            </div>
        </Marker>
    )
}
