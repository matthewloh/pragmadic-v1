"use client"

import {
    BarChart,
    BotMessageSquareIcon,
    Briefcase,
    Building,
    Calendar,
    Coffee,
    FileText,
    Globe,
    HelpCircle,
    Home,
    MapPin,
    MessageSquare,
    Send,
    Settings,
    UserPlus,
    Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarItem,
    SidebarLabel,
} from "@/components/ui/sidebar"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"

const data = {
    teams: [
        {
            name: "DE Rantau",
            logo: Globe,
            plan: "Official",
        },
        {
            name: "TechNest Penang",
            logo: Coffee,
            plan: "Business",
        },
        {
            name: "Digital Nomad",
            logo: Briefcase,
            plan: "Personal",
        },
    ],
    user: {
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatars/john-doe.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Home,
            isActive: true,
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
                    icon: UserPlus,
                    description: "Manage your profile",
                },
                {
                    title: "Settings",
                    url: "/settings",
                    icon: Settings,
                    description: "Configure your account",
                },
            ],
        },
        {
            title: "RAG Chat",
            url: "/chat",
            icon: BotMessageSquareIcon,
            items: [
                {
                    title: "Application Chat",
                    url: "/chat/general",
                    icon: MessageSquare,
                    description: "Chat with an intelligent context-aware agent",
                },
                {
                    title: "Partner Exploration",
                    url: "/chat/hubs",
                    icon: HelpCircle,
                    description: "Queries related to DE Rantau partners",
                },
            ],
        },
        {
            title: "Visa Application",
            url: "/visa-application",
            icon: FileText,
            items: [
                {
                    title: "Apply",
                    url: "/visa-application/apply",
                    icon: FileText,
                    description: "Start your DE Rantau visa application",
                },
                {
                    title: "Status",
                    url: "/visa-application/status",
                    icon: HelpCircle,
                    description: "Check your application status",
                },
                {
                    title: "Requirements",
                    url: "/visa-application/requirements",
                    icon: FileText,
                    description: "View visa requirements",
                },
            ],
        },
        {
            title: "Community",
            url: "/community",
            icon: Users,
            items: [
                {
                    title: "Events",
                    url: "/community/events",
                    icon: Calendar,
                    description: "Discover local events",
                },
                {
                    title: "Forum",
                    url: "/community/forum",
                    icon: MessageSquare,
                    description: "Connect with other digital nomads",
                },
                {
                    title: "Resources",
                    url: "/community/resources",
                    icon: HelpCircle,
                    description: "Access community resources",
                },
            ],
        },
        {
            title: "DE Rantau Hubs",
            url: "/hubs",
            icon: MapPin,
            items: [
                {
                    title: "Coworking Spaces",
                    url: "/hubs/coworking",
                    icon: Coffee,
                    description: "Find coworking spaces",
                },
                {
                    title: "Accommodations",
                    url: "/hubs/accommodations",
                    icon: Building,
                    description: "Discover accommodations",
                },
                {
                    title: "Local Businesses",
                    url: "/hubs/businesses",
                    icon: Briefcase,
                    description: "Explore local businesses",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "/support",
            icon: HelpCircle,
        },
        {
            title: "Feedback",
            url: "/feedback",
            icon: Send,
        },
    ],
    projects: [
        {
            name: "Penang Digital Nomad Guide",
            url: "/projects/penang-guide",
            icon: Globe,
        },
        {
            name: "Community Events",
            url: "/projects/community-events",
            icon: Calendar,
        },
        {
            name: "Local Business Directory",
            url: "/projects/business-directory",
            icon: Building,
        },
    ],
    searchResults: [
        {
            title: "DE Rantau Visa Application Process",
            teaser: "Learn about the step-by-step process for applying for the DE Rantau visa program for digital nomads in Malaysia.",
            url: "/visa-application/process",
        },
        {
            title: "Coworking Spaces in Penang",
            teaser: "Discover the best coworking spaces for digital nomads in Penang, including amenities, pricing, and locations.",
            url: "/hubs/coworking",
        },
        {
            title: "Upcoming Digital Nomad Events",
            teaser: "Stay updated on the latest meetups, workshops, and networking events for digital nomads in Penang.",
            url: "/community/events",
        },
        {
            title: "Living in Penang: A Digital Nomad's Guide",
            teaser: "Everything you need to know about living in Penang as a digital nomad, from accommodation to local culture.",
            url: "/resources/penang-guide",
        },
        {
            title: "DE Rantau Hub Partners",
            teaser: "Explore the official DE Rantau Hub partners offering special rates and services for digital nomads in Malaysia.",
            url: "/hubs/partners",
        },
    ],
}

export function AppSidebar() {
    const { data: user } = useCurrentUser()

    return (
        <Sidebar>
            <SidebarHeader className="h-14">
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarItem>
                    <SidebarLabel>DE Rantau Platform</SidebarLabel>
                    <NavMain
                        items={data.navMain}
                        searchResults={data.searchResults}
                    />
                </SidebarItem>
                <SidebarItem>
                    <SidebarLabel>Quick Access</SidebarLabel>
                    <NavProjects projects={data.projects} />
                </SidebarItem>
                <SidebarItem className="mt-auto">
                    <SidebarLabel>Help & Support</SidebarLabel>
                    <NavSecondary items={data.navSecondary} />
                </SidebarItem>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
