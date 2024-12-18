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
            className={`relative flex min-h-screen flex-col bg-background font-sans ${outfit.className}`}
        >
            <LandingHeader />
            <main className="flex w-full flex-1 flex-col overflow-x-hidden">
                <HeroSection />
                <ChatbotSection />
                <DeRantauSection />
                <NomadNetworkSection />
                {/* <PragmadicPromisesSection /> */}
            </main>
            <LandingFooter />
        </div>
    )
}
