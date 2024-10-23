"use client"

import { outfit } from "@/utils/fonts"
import { HeroSection } from "./HeroSection"
import { ChatbotSection } from "./ChatbotSection"
import { DeRantauSection } from "./DeRantauSection"
import { NomadNetworkSection } from "./NomadNetworkSection"
import { PragmadicPromisesSection } from "./PragmadicPromisesSection"
import { LandingFooter } from "./LandingFooter"
import { LandingHeader } from "./Header"

export function LandingHero() {
    return (
        <div
            className={`flex min-h-screen flex-col bg-background font-sans ${outfit.className}`}
        >
            <main className="flex-grow">
                <HeroSection />
                <LandingHeader />
                <ChatbotSection />
                <DeRantauSection />
                <NomadNetworkSection />
                <PragmadicPromisesSection />
            </main>
            <LandingFooter />
        </div>
    )
}
