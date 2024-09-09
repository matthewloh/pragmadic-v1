import { AppSidebar } from "@/components/app-sidebar"
import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar"
import MainNavBar from "@/features/dashboard/components/MainNavBar"
import { cookies } from "next/headers"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarLayout
            defaultOpen={cookies().get("sidebar:state")?.value === "true"}
        >
            <AppSidebar />
            <main className="flex min-h-full flex-1 flex-col space-y-4 transition-all duration-300 ease-in-out">
                <MainNavBar />
                <main className="container mx-auto flex h-full flex-1 flex-col border border-border">
                    {children}
                </main>
            </main>
        </SidebarLayout>
    )
}
