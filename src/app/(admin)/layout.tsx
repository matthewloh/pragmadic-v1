import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import MainNavBar from "@/features/dashboard/components/MainNavBar"
import { outfit } from "@/utils/fonts"
import { cookies } from "next/headers"

export default async function AdminLayout({
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
                <header className="sticky top-0 z-10 border-b border-border bg-background/70 backdrop-blur-sm">
                    <div className="flex h-[60px] items-center justify-between">
                        <MainNavBar />
                    </div>
                </header>
                <div
                    className={`container relative flex h-full flex-grow overflow-hidden ${outfit.className}`}
                >
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}
