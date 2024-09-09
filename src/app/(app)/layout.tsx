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
            <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
                <MainNavBar />
                <main className="flex-1 overflow-hidden">
                    <div className="max-w-9xl container mx-auto h-full px-4 py-6 sm:px-6 lg:px-8">
                        <div className="relative h-full rounded-lg border border-dashed bg-gradient-to-br from-emerald-500 to-purple-300 shadow-sm">
                            <div className="absolute inset-0 overflow-auto bg-background/65 p-4 sm:p-6 lg:p-8">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </SidebarLayout>
    )
}
