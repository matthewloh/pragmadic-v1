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

export const navItems: NavItem[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        items: [
            { title: "Overview", url: "/dashboard/overview", icon: BarChart },
            { title: "Settings", url: "/dashboard/settings", icon: Settings },
        ],
    },
]

export const chatbotItems: NavItem[] = [
    {
        title: "RAG Chatbot",
        url: "/chat",
        icon: MessageCircle,
    },
]

export const quickAccessItems = [
    { name: "Penang Digital Nomad Guide", url: "/onboarding", icon: Globe },
    { name: "DE Rantau Regions", url: "/regions", icon: Flag },
    { name: "DE Rantau States", url: "/states", icon: MapPin },
    { name: "Hub Events", url: "/events", icon: Calendar },
    { name: "Hub Reviews", url: "/reviews", icon: Star },
    { name: "Communities", url: "/communities", icon: Users },
    { name: "Local Business Directory", url: "/hubs", icon: Building },
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

export const getProfileItems = (role: string) => {
    const baseItems = [
        {
            title: "User Profile",
            url: "/profile",
            icon: SquareUser,
            description: "Manage your profile",
        },
    ]
    switch (role) {
        case "regular":
            return [
                ...baseItems,
                {
                    title: "Nomad Profile",
                    url: "/nomad-profile",
                    icon: TentTree,
                    description: "Manage your nomad profile",
                },
            ]
        case "owner":
            return [
                ...baseItems,
                {
                    title: "Hub Owner Profile",
                    url: "/hub-owner-profile",
                    icon: Briefcase,
                    description: "Manage your hub owner profile",
                },
            ]
        case "admin":
            return [
                ...baseItems,
                {
                    title: "Admin Profile",
                    url: "/derantau-admin-profile",
                    icon: ShieldCheck,
                    description: "Manage your admin profile",
                },
            ]
        default:
            return baseItems
    }
}
