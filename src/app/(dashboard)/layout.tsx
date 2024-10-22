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
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
                <div className="h-full">{children}</div>
            </main>
        </SidebarProvider>
    )
}
