import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

export default async function AnalyticsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "false"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="relative h-screen w-full flex-1 overflow-hidden">
                {children}
            </main>
        </SidebarProvider>
    )
}
