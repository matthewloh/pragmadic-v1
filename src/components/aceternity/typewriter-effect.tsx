"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { motion, useAnimate } from "framer-motion"
import { cn } from "@/lib/utils"

type Word = {
    text: string
    className?: string
}

type TypewriterEffectProps = {
    words: Word[][]
    className?: string
    cursorClassName?: string
}

const useTypewriterEffect = (words: Word[][]) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [currentWord, setCurrentWord] = useState("")
    const [scope, animate] = useAnimate()

    const currentFullWord = useMemo(
        () => words[currentWordIndex][1].text,
        [words, currentWordIndex],
    )

    const animateTyping = useCallback(async () => {
        await animate(scope.current, { opacity: 1 }, { duration: 0.5 })
        setCurrentWord("")

        await new Promise((resolve) => setTimeout(resolve, 500))

        for (let i = 0; i < currentFullWord.length; i++) {
            setCurrentWord((prev) => prev + currentFullWord[i])
            await new Promise((resolve) => setTimeout(resolve, 100))
        }

        await new Promise((resolve) => setTimeout(resolve, 2000))
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, [animate, currentFullWord, scope, words.length])

    useEffect(() => {
        animateTyping()
    }, [animateTyping])

    return { scope, currentWordIndex, currentWord }
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
    words,
    className,
    cursorClassName,
}) => {
    const { scope, currentWordIndex, currentWord } = useTypewriterEffect(words)

    return (
        <div className={cn("text-center font-bold", className)}>
            <motion.div ref={scope} className="inline-block">
                <span className="inline-block">
                    {words[currentWordIndex][0].text}&nbsp;
                </span>
                <span
                    className={cn(
                        "inline-block",
                        words[currentWordIndex][1].className,
                    )}
                >
                    {currentWord}
                </span>
            </motion.div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
                className={cn(
                    "inline-block h-4 w-[4px] rounded-sm bg-blue-500 md:h-6 lg:h-10",
                    cursorClassName,
                )}
            />
        </div>
    )
}

type TypewriterEffectSmoothProps = {
    words: Word[]
    className?: string
    cursorClassName?: string
}

export const TypewriterEffectSmooth: React.FC<TypewriterEffectSmoothProps> = ({
    words,
    className,
    cursorClassName,
}) => {
    const wordsArray = useMemo(
        () => words.map((word) => ({ ...word, text: word.text.split("") })),
        [words],
    )

    const renderWords = useCallback(
        () => (
            <div>
                {wordsArray.map((word, idx) => (
                    <div key={`word-${idx}`} className="inline-block">
                        {word.text.map((char, index) => (
                            <span
                                key={`char-${index}`}
                                className={cn(
                                    `text-black dark:text-white`,
                                    word.className,
                                )}
                            >
                                {char}
                            </span>
                        ))}
                        &nbsp;
                    </div>
                ))}
            </div>
        ),
        [wordsArray],
    )

    return (
        <div className={cn("my-6 flex space-x-1", className)}>
            <motion.div
                className="overflow-hidden pb-2"
                initial={{ width: "0%" }}
                whileInView={{ width: "fit-content" }}
                transition={{ duration: 2, ease: "linear", delay: 1 }}
            >
                <div
                    className="lg:text:3xl text-xs font-bold sm:text-base md:text-xl xl:text-5xl"
                    style={{ whiteSpace: "nowrap" }}
                >
                    {renderWords()}
                </div>
            </motion.div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
                className={cn(
                    "block h-4 w-[4px] rounded-sm bg-blue-500 sm:h-6 xl:h-12",
                    cursorClassName,
                )}
            />
        </div>
    )
}
