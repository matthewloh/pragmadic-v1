"use client"

import { motion } from "framer-motion"
import { OnboardingBentoGrid } from "@/components/onboarding/OnboardingBentoGrid"

const titleWords = "Pragmadic Onboarding Module".split(" ")

const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
        },
    }),
}

function EnhancedTitle() {
    return (
        <h1 className="mb-8 text-center text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
            {titleWords.map((word, index) => (
                <motion.span
                    key={index}
                    variants={titleVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="inline-block"
                >
                    <span className="mr-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-primary">
                        {word}
                    </span>
                </motion.span>
            ))}
        </h1>
    )
}

const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: 0.2 },
    },
}

export function OnboardingDashboard() {
    return (
        <div className="flex h-full flex-col">
            <div className="container mx-auto flex flex-grow flex-col py-8">
                <EnhancedTitle />
                <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex-grow"
                >
                    <OnboardingBentoGrid />
                </motion.div>
            </div>
        </div>
    )
}
