import { Calendar, Info, MapPin } from "lucide-react"

interface MarkerIconProps {
    type: "event" | "location" | "info"
    className?: string
}

export function MarkerIcon({ type, className = "h-4 w-4" }: MarkerIconProps) {
    switch (type) {
        case "event":
            return <Calendar className={className} />
        case "location":
            return <MapPin className={className} />
        case "info":
            return <Info className={className} />
        default:
            return <MapPin className={className} />
    }
}
