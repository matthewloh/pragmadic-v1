"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackButtonProps {
    href: string
    query: Record<string, string>
    label: string
}

export function BackButton({ href, query, label }: BackButtonProps) {
    const router = useRouter()

    const handleBack = () => {
        const queryString = new URLSearchParams(query).toString()
        const url = queryString ? `${href}?${queryString}` : href
        router.push(url)
    }

    return (
        <Button
            variant="ghost"
            className="group flex items-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleBack}
        >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {label}
        </Button>
    )
}
