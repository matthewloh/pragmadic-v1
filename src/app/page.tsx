import { LandingHero } from "@/components/landing-hero"

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
}

export default async function LandingPage() {
    return (
        <div className="min-h-screen w-full overflow-x-hidden">
            <LandingHero />
        </div>
    )
}
