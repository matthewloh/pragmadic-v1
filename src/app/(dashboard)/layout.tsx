import { AppSidebar } from "@/components/app-sidebar"
import { AutumnFireGradient } from "@/components/gradients"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import MainNavBar from "@/features/dashboard/components/MainNavBar"
import { getUserRole } from "@/lib/auth/get-user-role"
import { cookies } from "next/headers"

export default async function DashboardLayout({
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
                <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-xl">
                    <div className="flex h-[60px] items-center justify-between">
                        <MainNavBar />
                    </div>
                </header>
                <main className="flex h-full w-full flex-grow">{children}</main>
            </div>
        </SidebarProvider>
    )
}
