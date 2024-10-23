import { MapComponent } from "@/features/onboarding/components/MapComponent"
import { MapSidebar } from "@/features/onboarding/components/MapSidebar"

export default function MapPage() {
    return (
        <div className="relative h-screen w-full">
            <MapComponent />
            <MapSidebar />
        </div>
    )
}
