import { RoleType } from "@/lib/auth/get-user-role"
import {
    BarChart,
    Briefcase,
    Building,
    Calendar,
    Flag,
    Globe,
    HelpCircle,
    Home,
    LucideIcon,
    MapPin,
    MessageCircle,
    Send,
    Settings,
    ShieldCheck,
    SquareUser,
    Star,
    TentTree,
    User,
    UserPen,
    Users,
} from "lucide-react"

interface NavItem {
    title: string
    url: string
    icon: LucideIcon
    items?: Omit<NavItem, "items">[]
}

export const pragmadicFeatures: NavItem[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "RAG Chatbot",
        url: "/chat",
        icon: MessageCircle,
    },
]

export const deRantauPlatform: NavItem[] = [
    { title: "DE Rantau Regions", url: "/regions", icon: Flag },
    { title: "DE Rantau States", url: "/states", icon: MapPin },
    { title: "Hub Events", url: "/events", icon: Calendar },
    { title: "Hub Reviews", url: "/reviews", icon: Star },
    { title: "Communities", url: "/communities", icon: Users },
    { title: "Local Business Directory", url: "/hubs", icon: Building },
]

export const onboardingSupport: NavItem[] = [
    { title: "Penang Digital Nomad Guide", url: "/onboarding", icon: Globe },
]

export const analyticsItems: NavItem[] = [
    { title: "Analytics", url: "/analytics", icon: BarChart },
]

export const helpSupportItems = [
    { title: "Support", url: "/support", icon: HelpCircle },
    { title: "Feedback", url: "/feedback", icon: Send },
]

export const teams = [
    { name: "DE Rantau", logo: "/path-to-logo.png", plan: "Official" },
    { name: "TechNest Penang", logo: "/path-to-logo.png", plan: "Business" },
    { name: "Digital Nomad", logo: "/path-to-logo.png", plan: "Personal" },
]

export const adminOnlyItems = [
    { title: "Admin Dashboard", url: "/admin", icon: Settings },
    { title: "User Management", url: "/admin/users", icon: Users },
    { title: "Hub Management", url: "/admin/hubs", icon: Building },
    {
        title: "Communities Management",
        url: "/admin/communities",
        icon: Calendar,
    },
]

export const ownerOnlyItems = [
    { title: "Hub Management", url: "/hubs", icon: Building },
    { title: "Events Management", url: "/events", icon: Calendar },
    { title: "Reviews Management", url: "/reviews", icon: Star },
]

export const getProfileItems = (roles: RoleType[]) => {
    const baseItems = [
        {
            title: "User Profile",
            url: "/profile",
            icon: SquareUser,
            description: "Manage your profile",
        },
    ]

    const profileItems = new Set([...baseItems])

    roles.forEach((role) => {
        switch (role) {
            case "nomad":
                profileItems.add({
                    title: "Nomad Profile",
                    url: "/nomad-profile",
                    icon: TentTree,
                    description: "Manage your nomad profile",
                })
                break
            case "owner":
                profileItems.add({
                    title: "Hub Owner Profile",
                    url: "/hub-owner-profile",
                    icon: Briefcase,
                    description: "Manage your hub owner profile",
                })
                break
            case "admin":
                profileItems.add({
                    title: "Admin Profile",
                    url: "/derantau-admin-profile",
                    icon: ShieldCheck,
                    description: "Manage your admin profile",
                })
                break
        }
    })

    return Array.from(profileItems)
}
