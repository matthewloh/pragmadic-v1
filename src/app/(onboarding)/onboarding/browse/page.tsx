import { BrowseServicesComponent } from "@/features/onboarding/components/BrowseServicesComponent"

export default function BrowsePage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Browse DE Rantau Services</h1>
            <BrowseServicesComponent />
        </div>
    )
}
