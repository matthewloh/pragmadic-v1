"use client"
import Image from "next/image"
import React from "react"
import { useSidebar } from "../ui/sidebar"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface PragmadicLogoProps {
    className?: string
}

export default function PragmadicLogo({ className = "" }: PragmadicLogoProps) {
    const { open } = useSidebar()

    return (
        <div
            className={cn(
                "flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-slate-50 to-amber-100 p-2 shadow-sm transition-all duration-300 hover:shadow-md dark:hover:shadow-slate-300",
                className,
                open ? "h-full flex-row gap-2 p-2" : "",
            )}
        >
            <div className="relative size-8 flex-shrink-0">
                <Image
                    src="/pragmadic.svg"
                    fill
                    alt="PRAGmadic Logo"
                    className="rounded-full object-contain object-center"
                    priority
                />
            </div>
            <motion.div
                className="overflow-hidden"
                initial={false}
                animate={{ width: open ? "auto" : 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.span
                    className="block whitespace-nowrap font-solway text-xl font-medium leading-tight text-amber-700 dark:text-amber-700"
                    initial={false}
                    animate={{ opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    pragmadic
                </motion.span>
            </motion.div>
        </div>
    )
}
