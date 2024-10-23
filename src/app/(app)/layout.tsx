import { AppSidebar } from "@/components/app-sidebar"
import { AutumnFireGradient } from "@/components/gradients"
import { SidebarProvider } from "@/components/ui/sidebar"
import MainNavBar from "@/features/dashboard/components/MainNavBar"
import { cookies } from "next/headers"

export default async function PagesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "false"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
                <AutumnFireGradient />
                <header className="sticky top-0 z-10 border-b border-border bg-background/70 backdrop-blur-3xl">
                    <div className="flex h-[60px] items-center justify-between">
                        <MainNavBar />
                    </div>
                </header>
                <main className="flex overflow-hidden">
                    <div className="flex-grow">
                        <div className="relative h-full border border-dashed shadow-sm">
                            <div className="relative flex h-full w-full flex-grow bg-background/50 p-16">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
