"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PromptSuggestions } from "@/components/ui/prompt-suggestions"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"

interface AnimatedPromptSuggestionsProps {
    sections: {
        label: string
        suggestions: string[]
    }[]
    append: (message: { role: "user"; content: string }) => void
    className?: string
}

export function AnimatedPromptSuggestions({
    sections,
    append,
    className,
}: AnimatedPromptSuggestionsProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [direction, setDirection] = React.useState(0)

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 500 : -500,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 500 : -500,
            opacity: 0,
        }),
    }

    const swipeConfidenceThreshold = 10000
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }

    const paginate = (newDirection: number) => {
        setDirection(newDirection)
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection
            if (nextIndex < 0) nextIndex = sections.length - 1
            if (nextIndex >= sections.length) nextIndex = 0
            return nextIndex
        })
    }

    return (
        <Card className={cn("relative overflow-hidden", className)}>
            <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 z-20 -translate-y-1/2"
                        onClick={() => paginate(-1)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="relative mx-8 min-h-[220px] w-full overflow-hidden">
                        <AnimatePresence
                            initial={false}
                            custom={direction}
                            mode="wait"
                        >
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    },
                                    opacity: { duration: 0.2 },
                                }}
                                className="absolute inset-0 w-full"
                            >
                                <PromptSuggestions
                                    label={sections[currentIndex].label}
                                    suggestions={
                                        sections[currentIndex].suggestions
                                    }
                                    append={append}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 z-20 -translate-y-1/2"
                        onClick={() => paginate(1)}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="mt-4 flex justify-center gap-2">
                    {sections.map((_, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-2 w-2 rounded-full p-0",
                                currentIndex === index
                                    ? "bg-primary"
                                    : "bg-muted",
                            )}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1)
                                setCurrentIndex(index)
                            }}
                        >
                            <span className="sr-only">
                                Go to suggestion section {index + 1}
                            </span>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
