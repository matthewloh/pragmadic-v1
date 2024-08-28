import { Navbar } from "@/app/(dashboard)/dashboard/navbar"
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar"
import React from "react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div className="h-full">{children}</div>
}
