import { ThemeProvider } from "next-themes"
import QueryProvider from "./query-provider"
import { TooltipProvider } from "./ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <TooltipProvider>{children}</TooltipProvider>
            </ThemeProvider>
        </QueryProvider>
    )
}
