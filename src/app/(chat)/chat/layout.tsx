import { AppSidebar } from "@/components/app-sidebar"
import { PagesGradient } from "@/components/gradients"
import { SidebarLayout } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

export default function ChatLayout({
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
                <div className="h-full bg-background">{children}</div>
            </div>
        </SidebarLayout>
    )
}
