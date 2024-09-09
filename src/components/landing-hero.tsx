"use client"

import CallToActionSection from "@/features/landing/components/CallToActionSection"
import ContactSection from "@/features/landing/components/ContactSection"
import CustomerLogoListSection from "@/features/landing/components/CustomerLogoListSection"
import FAQSection from "@/features/landing/components/FAQSection"
import FeatureListSection from "@/features/landing/components/FeatureListSection"
import FeatureSection from "@/features/landing/components/FeatureSection"
import HeroHeader from "@/features/landing/components/HeroHeader"
import LandingFooter from "@/features/landing/components/LandingFooter"
import NewsletterSection from "@/features/landing/components/NewsletterSection"
import ServicesSection from "@/features/landing/components/ServicesSection"
import TeamSection from "@/features/landing/components/TeamSection"
import { LandingHeader } from "./Header"

export function LandingHero() {
    return (
        <div className="flex min-h-screen flex-col bg-primary">
            {/* Navbar */}
            <LandingHeader />
            <main className="flex-grow bg-background">
                {/* Hero Header Section */}
                <HeroHeader />
                {/* Feature Section */}
                <FeatureSection />
                {/* Features List Section */}
                <FeatureListSection />
                {/* Services Section */}
                <ServicesSection />
                {/* Team Section */}
                <TeamSection />
                {/* Customer Logos List Section */}
                <CustomerLogoListSection />
                {/* CTA Section */}
                <CallToActionSection />
                {/* Newsletter Section */}
                <NewsletterSection />
                {/* FAQ Section */}
                <FAQSection />
                {/* Contact Section */}
                <ContactSection />
            </main>

            {/* Footer */}
            <LandingFooter />
        </div>
    )
}

