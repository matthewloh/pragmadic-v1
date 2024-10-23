import { MapComponent } from "@/features/onboarding/components/MapComponent"
import { MapSidebar } from "@/features/onboarding/components/MapSidebar"

export default function OnboardingPage() {
    return (
        <main className="flex">
            <MapSidebar />
            <div className="w-full">
                <MapComponent />
            </div>
        </main>
    )
}
