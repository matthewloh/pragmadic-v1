import Image from "next/image"
import React from "react"

interface PragmadicLogoProps {
    className?: string
}

export default function PragmadicLogo({ className = "" }: PragmadicLogoProps) {
    return (
        <div
            className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-50 to-amber-100 px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md dark:hover:shadow-slate-300 ${className}`}
        >
            <div className="relative h-8 w-8 flex-shrink-0">
                <Image
                    src="/pragmadic.svg"
                    fill
                    sizes="32px"
                    alt="PRAGmadic Logo"
                    className="object-contain"
                    priority
                />
            </div>
            <div className="overflow-hidden">
                <span className="block font-solway text-xl font-medium leading-tight text-amber-700 dark:text-amber-700">
                    pragmadic
                </span>
            </div>
        </div>
    )
}
