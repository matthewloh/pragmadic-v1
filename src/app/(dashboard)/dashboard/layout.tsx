import React from "react"
import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full">
            <Navbar />
            <div className="flex h-[calc(100vh-40px)]">
                <Sidebar />
                {children}
            </div>
        </div>
    )
}
