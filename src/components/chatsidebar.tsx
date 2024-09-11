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
    Hospital,
    House,
    MapPin,
    MessageSquare,
    Send,
    Settings,
    User,
    UserPen,
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
                    icon: User,
                    description: "Manage your profile",
                },
                {
                    title: "Nomad Profile",
                    url: "/nomad-profile",
                    icon: UserPen,
                    description: "Manage your profile",
                },
                {
                    title: "DE Rantau Profile",
                    url: "/derantau-admin-profile",
                    icon: User,
                    description: "Manage your profile",
                },
                {
                    title: "Hub Owner Profile",
                    url: "/hub-owner-profile",
                    icon: User,
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
            url: "/visa-applications",
            icon: FileText,
            items: [
                {
                    title: "Health Clearance Info",
                    url: "/health-clearance-info/",
                    icon: Hospital,
                    description: "Manage your health clearance info",
                },
                {
                    title: "Accommodation Proofs",
                    url: "accommodation-proofs",
                    icon: House,
                    description: "Manage your accommodation proofs",
                },
                {
                    title: "Financial Proofs",
                    url: "/financial-proofs",
                    icon: Briefcase,
                    description: "Manage your financial proofs",
                },
                {
                    title: "Work Contract Proofs",
                    url: "/work-contract-proofs",
                    icon: Briefcase,
                    description: "Manage your work contract proofs",
                },
            ],
        },
        {
            title: "Community",
            url: "/communities",
            icon: Users,
            items: [
                {
                    title: "Events",
                    url: "/events",
                    icon: Calendar,
                    description: "Discover local events",
                },
                {
                    title: "Community Events",
                    url: "/community-events",
                    icon: MessageSquare,
                    description: "Connect with other digital nomads",
                },
                {
                    title: "Community Posts",
                    url: "/community-posts",
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
        {
            title: "Regions",
            url: "/regions",
            icon: Globe,
            items: [
                {
                    title: "States",
                    url: "/states",
                    icon: MapPin,
                    description: "Explore the states available in DE Rantau",
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

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Upload } from "lucide-react"
import { useState } from "react"

export function ChatSidebar() {
    return (
        <Sidebar className="w-60 border-r">
            {/* <SidebarHeader className="h-[60px]">
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader> */}
            {/* <SidebarContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="rag-settings">
                        <AccordionTrigger>RAG Settings</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="model">Model</Label>
                                    <Select defaultValue="gpt-4">
                                        <SelectTrigger id="model">
                                            <SelectValue placeholder="Select model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gpt-4">
                                                GPT-4
                                            </SelectItem>
                                            <SelectItem value="gpt-3.5-turbo">
                                                GPT-3.5 Turbo
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="temperature">
                                        Temperature: {temperature}
                                    </Label>
                                    <Slider
                                        id="temperature"
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        value={[temperature]}
                                        onValueChange={(value) =>
                                            setTemperature(value[0])
                                        }
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="use-user-docs"
                                        checked={useUserDocs}
                                        onCheckedChange={setUseUserDocs}
                                    />
                                    <Label htmlFor="use-user-docs">
                                        Use self-uploaded documents
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="use-official-docs"
                                        checked={useOfficialDocs}
                                        onCheckedChange={setUseOfficialDocs}
                                    />
                                    <Label htmlFor="use-official-docs">
                                        Use official DE Rantau documents
                                    </Label>
                                </div>
                                <Button className="w-full">
                                    <Upload className="mr-2 h-4 w-4" /> Upload
                                    Document
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
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
            </SidebarContent> */}
            {/* <SidebarFooter>
                <NavUser />
            </SidebarFooter> */}
        </Sidebar>
    )
}
