import { useEffect, useRef, useState } from "react"

export function useAutoScroll(dependencies: React.DependencyList) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

    const scrollToBottom = () => {
        if (containerRef.current) {
            const viewport = containerRef.current.querySelector(
                "[data-radix-scroll-area-viewport]",
            )
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight
            }
        }
    }

    const handleScroll = () => {
        if (containerRef.current) {
            const viewport = containerRef.current.querySelector(
                "[data-radix-scroll-area-viewport]",
            )
            if (viewport) {
                const { scrollTop, scrollHeight, clientHeight } =
                    viewport as HTMLElement
                const distanceFromBottom =
                    scrollHeight - scrollTop - clientHeight
                setShouldAutoScroll(distanceFromBottom < 100)
            }
        }
    }

    useEffect(() => {
        const timer = setTimeout(scrollToBottom, 100)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (shouldAutoScroll) {
            const timer = setTimeout(scrollToBottom, 100)
            return () => clearTimeout(timer)
        }
    }, [shouldAutoScroll])

    return { containerRef, scrollToBottom, handleScroll, shouldAutoScroll }
}
