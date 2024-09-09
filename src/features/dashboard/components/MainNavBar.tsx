import PragmadicLogo from "@/components/branding/pragmadic-logo"
import { SidebarTrigger } from "@/components/ui/sidebar"
import UserButtonSupabase from "@/features/auth/components/UserButtonSupabase"
import Link from "next/link"
import React from "react"

export default function MainNavBar() {
    return (
        <div className="flex h-[60px] w-full items-center justify-between border-b">
            <div className="m-auto mr-4 flex w-full flex-row items-center justify-between">
                <div className="flex items-center">
                    <SidebarTrigger className="h-[60px]" />
                    <Link href="/dashboard" className="flex font-semibold">
                        <PragmadicLogo />
                    </Link>
                </div>
                <UserButtonSupabase />
            </div>
        </div>
    )
}
