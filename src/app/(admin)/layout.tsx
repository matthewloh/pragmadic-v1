import { AdminSidebar } from "@/components/admin-sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AutumnFireGradient } from "@/components/gradients"
import { SidebarProvider } from "@/components/ui/sidebar"
import MainNavBar from "@/features/dashboard/components/MainNavBar"
import { cookies } from "next/headers"

export default async function AdminLayout({
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
                {/* <AutumnFireGradient /> */}
                <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
                    <div className="flex h-[60px] items-center justify-between">
                        <MainNavBar />
                    </div>
                </header>
                <div className="container relative flex h-full flex-grow overflow-hidden">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}
