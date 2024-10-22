import { AppSidebar } from "@/components/app-sidebar"
import { SidebarLayout } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

export default async function ChatLayout({
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
            <AppSidebar />
            <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
                <div className="h-full bg-background">{children}</div>
            </div>
        </SidebarLayout>
    )
}
