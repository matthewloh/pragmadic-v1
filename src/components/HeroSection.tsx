"use client"

import { useMemo } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"
import { ChevronDown } from "lucide-react"
import { FlipWords } from "./aceternity/flip-words"

const HERO_IMAGE_URL =
    "https://images.unsplash.com/photo-1654201935898-a096c66db700?q=100&w=2725&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

export function HeroSection() {
    const { theme } = useTheme()

    const words = useMemo(
        () => [
            {
                text: "Living",
                className:
                    "bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent drop-shadow-sm",
            },
            {
                text: "Networking",
                className:
                    "bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent drop-shadow-sm",
            },
            {
                text: "Onboarding",
                className:
                    "bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent drop-shadow-sm",
            },
            {
                text: "Community",
                className:
                    "bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-400 dark:to-yellow-500 bg-clip-text text-transparent drop-shadow-sm",
            },
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
                className={`object-cover ${
                    theme === "dark"
                        ? "brightness-[0.4] contrast-[1.1]"
                        : "brightness-[0.85] contrast-[1.05]"
                }`}
            />

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/40 backdrop-blur-[2px] dark:from-background/90 dark:via-background/70 dark:to-background/60" />

            {/* Semi-transparent backdrop for text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-6xl px-4">
                    <div className="rounded-xl bg-background/20 p-8 text-center backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="group"
                        >
                            <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-md">
                                <span className="inline-block bg-gradient-to-b from-foreground to-foreground/90 bg-clip-text text-transparent">
                                    Pragmadic
                                </span>
                                <span className="inline-block">
                                    <FlipWords
                                        words={words.map((w) => w.text)}
                                        duration={3000}
                                        className={(text: string) =>
                                            words.find((w) => w.text === text)
                                                ?.className || ""
                                        }
                                    />
                                </span>
                            </h1>
                        </motion.div>

                        <motion.h2
                            className="mx-auto mb-4 mt-6 max-w-3xl text-xl font-bold tracking-wide text-foreground/90 drop-shadow-sm sm:text-2xl md:text-3xl lg:text-4xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className="bg-gradient-to-r from-foreground to-foreground/90 bg-clip-text text-transparent">
                                The Gateway to Digital Nomadism in Penang
                            </span>
                        </motion.h2>

                        <motion.p
                            className="mx-auto mb-8 max-w-xl text-base font-medium leading-relaxed text-foreground/90 drop-shadow-sm sm:text-lg md:text-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Discover a vibrant community and endless
                            opportunities for digital nomads in the heart of
                            Penang.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="group"
                        >
                            <Button
                                size="lg"
                                className="transform bg-primary/90 text-lg font-semibold tracking-wide text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary"
                            >
                                Get Started
                            </Button>
                        </motion.div>
                    </div>
                </div>
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
                    className="h-8 w-8 animate-bounce text-foreground/80 drop-shadow-md"
                    aria-hidden="true"
                />
            </motion.div>
        </section>
    )
}
