"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    adminOnlyItems,
    analyticsItems,
    deRantauPlatform,
    getProfileItems,
    onboardingSupport,
    pragmadicFeatures,
} from "@/config/sidebar-config"
import { useUserRole } from "@/features/auth/hooks/use-user-role"
import { outfit } from "@/utils/fonts"
import { ChevronDownCircle } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import PragmadicLogo from "./branding/pragmadic-logo"
import { NavUser } from "./nav-user"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible"

export function AppSidebar() {
    const { data: userRoleData } = useUserRole()

    const sidebarContent = React.useMemo(() => {
        if (!userRoleData?.user_roles) return null

        const profileItems = getProfileItems(userRoleData.user_roles)

        return (
            <>
                <SidebarHeader className="border-b">
                    <SidebarMenu>
                        <SidebarMenuItem className="rounded-xl">
                            <Link href="/dashboard" className="w-full">
                                <PragmadicLogo className="w-full" />
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            Pragmadic Features
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {pragmadicFeatures.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            {item.icon && (
                                                <item.icon className="mr-2 h-4 w-4" />
                                            )}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>

                    <Collapsible
                        defaultOpen={true}
                        className="group/collapsible"
                    >
                        <SidebarGroup>
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger>
                                    DE Rantau Platform
                                    <ChevronDownCircle className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarMenu>
                                    {deRantauPlatform.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.url}>
                                                    {item.icon && (
                                                        <item.icon className="mr-2 h-4 w-4" />
                                                    )}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>

                    <SidebarGroup>
                        <SidebarGroupLabel>
                            Onboarding Support
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {onboardingSupport.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            {item.icon && (
                                                <item.icon className="mr-2 h-4 w-4" />
                                            )}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>

                    {userRoleData.user_roles.includes("owner") && (
                        <SidebarGroup>
                            <SidebarGroupLabel>Analytics</SidebarGroupLabel>
                            <SidebarMenu>
                                {analyticsItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                {item.icon && (
                                                    <item.icon className="mr-2 h-4 w-4" />
                                                )}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    )}

                    {userRoleData.user_roles.includes("admin") && (
                        <SidebarGroup>
                            <SidebarGroupLabel>Admin</SidebarGroupLabel>
                            <SidebarMenu>
                                {adminOnlyItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                {item.icon && (
                                                    <item.icon className="mr-2 h-4 w-4" />
                                                )}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    )}

                    <SidebarGroup>
                        <SidebarGroupLabel>
                            Profile Management
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {profileItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            {item.icon && (
                                                <item.icon className="mr-2 h-4 w-4" />
                                            )}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
            </>
        )
    }, [userRoleData])

    if (!userRoleData) return null

    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className={`${outfit.className}`}
        >
            {sidebarContent}
            <SidebarRail />
        </Sidebar>
    )
}
