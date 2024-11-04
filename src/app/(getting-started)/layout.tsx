import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

export default async function GettingStartedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "false"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="h-screen w-full flex-1 flex-col transition-all duration-300 ease-in-out">
                <div className="h-full w-full">{children}</div>
            </main>
        </SidebarProvider>
    )
}
