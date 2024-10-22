import { AppSidebar } from "@/components/app-sidebar"
import PragmadicLogo from "@/components/branding/pragmadic-logo"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import UserButtonSupabase from "@/features/auth/components/UserButtonSupabase"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
                <header className="sticky top-0 z-10 border-b border-border bg-transparent backdrop-blur-3xl">
                    <div className="flex h-[60px] w-full items-center justify-between border-b">
                        <div className="m-auto mr-4 flex w-full flex-row items-center justify-between bg-transparent">
                            <div className="flex items-center bg-transparent">
                                <SidebarTrigger className="h-[60px]" />
                                <Link
                                    href="/dashboard"
                                    className="flex font-semibold"
                                >
                                    <PragmadicLogo />
                                </Link>
                            </div>
                            <UserButtonSupabase />
                        </div>
                    </div>
                </header>
                <main className="flex overflow-hidden">
                    <div className="flex-grow">
                        <div className="relative h-full shadow-sm">
                            <div className="h-full bg-transparent">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
