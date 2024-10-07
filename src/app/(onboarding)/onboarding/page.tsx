import { MapComponent } from "@/features/onboarding/components/MapComponent"
import { MapSidebar } from "@/features/onboarding/components/MapSidebar"
import { ToolbarComponent } from "@/features/onboarding/components/ToolbarComponent"

export default function MapPage() {
    return (
        <main className="flex h-full w-screen">
            <MapSidebar />
            <div className="h-screen w-full">
                <MapComponent />
                <ToolbarComponent />
            </div>
        </main>
    )
}
