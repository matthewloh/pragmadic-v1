import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import MainNavBar from "@/features/dashboard/components/MainNavBar"
import { outfit } from "@/utils/fonts"
import { cookies } from "next/headers"

export default async function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "false"

    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
                <main className="flex flex-grow overflow-auto">
                    <div
                        className={`relative flex h-full w-full flex-grow shadow-sm ${outfit.className}`}
                    >
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
