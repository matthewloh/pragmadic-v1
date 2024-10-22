import { AdminSidebar } from "@/components/admin-sidebar"
import { AutumnFireGradient } from "@/components/gradients"
import { SidebarLayout } from "@/components/ui/sidebar"
import MainNavBar from "@/features/dashboard/components/MainNavBar"
import { cookies } from "next/headers"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarLayout
            defaultOpen={
                (await cookies()).get("sidebar:state")?.value === "true"
            }
        >
            <AdminSidebar />
            <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
                <AutumnFireGradient />
                <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
                    <div className="flex h-[60px] items-center justify-between">
                        <MainNavBar />
                    </div>
                </header>
                <div className="container relative flex h-full flex-grow overflow-hidden">
                    {children}
                </div>
            </div>
        </SidebarLayout>
    )
}
