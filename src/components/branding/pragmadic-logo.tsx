import Image from "next/image"
import React from "react"

interface PragmadicLogoProps {
    className?: string
}

export default function PragmadicLogo({ className = "" }: PragmadicLogoProps) {
    return (
        <div
            className={`flex items-center justify-center gap-2 rounded-3xl bg-accent bg-logo p-2 shadow dark:bg-logo ${className}`}
        >
            <div className="relative h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9">
                <Image
                    src="/pragmadic.svg"
                    fill
                    sizes="(max-width: 640px) 24px, (max-width: 768px) 32px, 36px"
                    alt="PRAGmadic Logo"
                    className="object-contain"
                />
            </div>
            <div className="overflow-hidden">
                <span className="block truncate font-solway text-lg font-normal leading-normal text-amber-700 sm:text-xl md:text-2xl">
                    pragmadic
                </span>
            </div>
        </div>
    )
}
