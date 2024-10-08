import { MapComponent } from "@/features/onboarding/components/MapComponent"
import { MapSidebar } from "@/features/onboarding/components/MapSidebar"
import { ToolbarComponent } from "@/features/onboarding/components/ToolbarComponent"

export default function MapPage() {
    return (
        <main className="flex">
            <MapSidebar />
            <div className="w-full">
                <MapComponent />
                <ToolbarComponent />
            </div>
        </main>
    )
}
