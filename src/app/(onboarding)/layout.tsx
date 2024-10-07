import { AppSidebar } from "@/components/app-sidebar"
import { SidebarLayout } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarLayout
            defaultOpen={cookies().get("sidebar:state")?.value === "true"}
        >
            <AppSidebar />
            <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
                {children}
            </main>
        </SidebarLayout>
    )
}
