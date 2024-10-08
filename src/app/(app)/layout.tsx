import { AppSidebar } from "@/components/app-sidebar"
import { PagesGradient } from "@/components/gradients"
import { SidebarLayout } from "@/components/ui/sidebar"
import MainNavBar from "@/features/dashboard/components/MainNavBar"
import { cookies } from "next/headers"

export default function PagesLayout({
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
                <PagesGradient />
                <header className="sticky top-0 z-10 border-b border-border bg-background/40 backdrop-blur-3xl">
                    <div className="flex h-[60px] items-center justify-between">
                        <MainNavBar />
                    </div>
                </header>
                <main className="flex overflow-hidden">
                    <div className="flex-grow">
                        <div className="relative h-full border border-dashed bg-gradient-to-tr from-emerald-500 to-purple-300 shadow-sm">
                            <div className="h-full bg-transparent p-16">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </SidebarLayout>
    )
}
