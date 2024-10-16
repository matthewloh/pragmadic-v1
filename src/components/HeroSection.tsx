"use client"

import { useMemo } from "react"
import Image from "next/image"
import { TypewriterEffect } from "./aceternity/typewriter-effect"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"
import { ChevronDown } from "lucide-react"

const HERO_IMAGE_URL =
    "https://images.unsplash.com/photo-1654201935898-a096c66db700?q=100&w=2725&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

export function HeroSection() {
    const { theme } = useTheme()

    const words = useMemo(
        () => [
            [
                { text: "Pragmadic" },
                {
                    text: "Living",
                    className: "text-blue-500 dark:text-blue-400",
                },
            ],
            [
                { text: "Pragmadic" },
                {
                    text: "Networking",
                    className: "text-green-500 dark:text-green-400",
                },
            ],
            [
                { text: "Pragmadic" },
                {
                    text: "Onboarding",
                    className: "text-purple-500 dark:text-purple-400",
                },
            ],
            [
                { text: "Pragmadic" },
                {
                    text: "Community",
                    className: "text-yellow-500 dark:text-yellow-400",
                },
            ],
        ],
        [],
    )

    return (
        <section className="relative h-screen w-full overflow-hidden">
            <Image
                src={HERO_IMAGE_URL}
                alt="Digital Nomad Workspace in Penang"
                fill
                priority
                className={`object-cover ${theme === "dark" ? "brightness-50" : "brightness-75"}`}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background/30 dark:from-background/80 dark:to-background/50" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <TypewriterEffect
                        words={words}
                        className="mb-4 text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
                    />
                </motion.div>
                <motion.h2
                    className="mb-6 max-w-3xl text-xl font-semibold text-foreground sm:text-2xl md:text-3xl lg:text-4xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    The Gateway to Digital Nomadism in Penang
                </motion.h2>
                <motion.p
                    className="mb-8 max-w-xl text-base text-muted-foreground sm:text-lg md:text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Discover a vibrant community and endless opportunities for
                    digital nomads in the heart of Penang.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <Button
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Get Started
                    </Button>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 1,
                    delay: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            >
                <ChevronDown
                    className="h-6 w-6 text-muted-foreground"
                    aria-hidden="true"
                />
            </motion.div>
        </section>
    )
}
