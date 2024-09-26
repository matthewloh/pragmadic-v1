import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarLayout } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarLayout
            defaultOpen={cookies().get("sidebar:state")?.value === "true"}
        >
            <AdminSidebar />
            <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
                <div className="h-full">{children}</div>
            </main>
        </SidebarLayout>
    )
}
