"use client"

import {
    BarChart,
    Building,
    FileText,
    Globe,
    HelpCircle,
    Home,
    MapPin,
    Send,
    Settings,
    User,
    UserCog,
    UserPen,
    Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarItem,
    SidebarLabel,
} from "@/components/ui/sidebar"

const adminData = {
    navMain: [
        {
            title: "Admin Home",
            url: "/admin",
            icon: Home,
            isActive: true,
            items: [
                {
                    title: "Overview",
                    url: "/admin",
                    icon: BarChart,
                    description: "View admin dashboard",
                },
                {
                    title: "User Management",
                    url: "/admin/users",
                    icon: Users,
                    description: "Manage user accounts",
                },
                {
                    title: "Settings",
                    url: "/admin/settings",
                    icon: Settings,
                    description: "Configure admin settings",
                },
            ],
        },
        {
            title: "User Management",
            url: "/admin/users",
            icon: Users,
            items: [
                {
                    title: "All Users",
                    url: "/admin/users",
                    icon: Users,
                    description: "View and manage all users",
                },
                {
                    title: "Digital Nomads",
                    url: "/admin/users/nomads",
                    icon: Globe,
                    description: "Manage digital nomad accounts",
                },
                {
                    title: "Hub Owners",
                    url: "/admin/users/hub-owners",
                    icon: Building,
                    description: "Manage hub owner accounts",
                },
                {
                    title: "Admins",
                    url: "/admin/users/admins",
                    icon: UserCog,
                    description: "Manage admin accounts",
                },
            ],
        },
        {
            title: "DE Rantau Hubs",
            url: "/admin/hubs",
            icon: Building,
            items: [
                {
                    title: "Manage Hubs",
                    url: "/admin/hubs",
                    icon: Building,
                    description: "View and manage DE Rantau hubs",
                },
                {
                    title: "Hub Applications",
                    url: "/admin/hubs/applications",
                    icon: FileText,
                    description: "Review hub partnership applications",
                },
            ],
        },
        {
            title: "Regions",
            url: "/admin/regions",
            icon: Globe,
            items: [
                {
                    title: "Manage Regions",
                    url: "/admin/regions",
                    icon: MapPin,
                    description: "Manage DE Rantau regions",
                },
                {
                    title: "Region Statistics",
                    url: "/admin/regions/stats",
                    icon: BarChart,
                    description: "View region-wise statistics",
                },
            ],
        },
        // Add regular dashboard navigation
        {
            title: "Regular Dashboard",
            url: "/dashboard",
            icon: Home,
            items: [
                {
                    title: "Overview",
                    url: "/dashboard",
                    icon: BarChart,
                    description: "View your dashboard",
                },
                {
                    title: "Profile",
                    url: "/profile",
                    icon: User,
                    description: "Manage your profile",
                },
                {
                    title: "Nomad Profile",
                    url: "/nomad-profile",
                    icon: UserPen,
                    description: "Manage your nomad profile",
                },
                {
                    title: "Hub Owner Profile",
                    url: "/hub-owner-profile",
                    icon: User,
                    description: "Manage your hub owner profile",
                },
                {
                    title: "Settings",
                    url: "/settings",
                    icon: Settings,
                    description: "Configure your account",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Admin Support",
            url: "/admin/support",
            icon: HelpCircle,
        },
        {
            title: "Feedback Management",
            url: "/admin/feedback",
            icon: Send,
        },
    ],
    searchResults: [
        {
            title: "User Management",
            teaser: "Manage user accounts, roles, and permissions for the DE Rantau platform.",
            url: "/admin/users",
        },
        {
            title: "Hub Partner Management",
            teaser: "Manage DE Rantau hub partners and review new partnership applications.",
            url: "/admin/hubs",
        },
        {
            title: "Region Administration",
            teaser: "Administer and view statistics for different regions in the DE Rantau program.",
            url: "/admin/regions",
        },
        {
            title: "Admin Dashboard",
            teaser: "Access the main admin dashboard for an overview of the DE Rantau platform.",
            url: "/admin/dashboard",
        },
    ],
}

export function AdminSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="h-[60px]">
                <div className="flex items-center px-4">
                    <Globe className="mr-2 h-6 w-6" />
                    <span className="font-bold">DE Rantau Admin</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarItem>
                    <SidebarLabel>Admin Navigation</SidebarLabel>
                    <NavMain
                        items={adminData.navMain}
                        searchResults={adminData.searchResults}
                    />
                </SidebarItem>
                <SidebarItem className="mt-auto">
                    <SidebarLabel>Admin Support</SidebarLabel>
                    <NavSecondary items={adminData.navSecondary} />
                </SidebarItem>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
