import { AppSidebar } from "@/components/app-sidebar"
import PragmadicLogo from "@/components/branding/pragmadic-logo"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import UserButtonSupabase from "@/features/auth/components/UserButtonSupabase"
import MainNavBar from "@/features/dashboard/components/MainNavBar"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
                <header className="sticky top-0 z-10 border-b border-border bg-background/70 backdrop-blur-3xl">
                    <div className="flex h-[60px] items-center justify-between">
                        <MainNavBar />
                    </div>
                </header>
                <main className="flex overflow-hidden">
                    <div className="flex-grow">
                        <div className="relative h-full shadow-sm">
                            <div className="h-full bg-transparent">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
