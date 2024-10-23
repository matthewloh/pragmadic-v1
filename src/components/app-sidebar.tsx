"use client"

import * as React from "react"
import Link from "next/link"
import { useUserRole } from "@/features/auth/hooks/use-user-role"
import { NavUser } from "./nav-user"
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
    pragmadicFeatures,
    deRantauPlatform,
    onboardingSupport,
    analyticsItems,
    getProfileItems,
    adminOnlyItems,
} from "@/config/sidebar-items"
import PragmadicLogo from "./branding/pragmadic-logo"

export function AppSidebar() {
    const { data: userRoleData } = useUserRole()

    const sidebarContent = React.useMemo(() => {
        if (!userRoleData?.role) return null

        const profileItems = getProfileItems(userRoleData.role)

        return (
            <>
                <SidebarHeader className="h-[60px] border-b">
                    <SidebarMenu>
                        <SidebarMenuItem className="p-0">
                            <Link href="/dashboard" className="block w-full">
                                <PragmadicLogo className="w-full" />
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Pragmadic Features</SidebarGroupLabel>
                        <SidebarMenu>
                            {pragmadicFeatures.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>DE Rantau Platform</SidebarGroupLabel>
                        <SidebarMenu>
                            {deRantauPlatform.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>Onboarding Support</SidebarGroupLabel>
                        <SidebarMenu>
                            {onboardingSupport.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>

                    {userRoleData.role === "owner" && (
                        <SidebarGroup>
                            <SidebarGroupLabel>Analytics</SidebarGroupLabel>
                            <SidebarMenu>
                                {analyticsItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    )}

                    {userRoleData.role === "admin" && (
                        <SidebarGroup>
                            <SidebarGroupLabel>Admin</SidebarGroupLabel>
                            <SidebarMenu>
                                {adminOnlyItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    )}

                    <SidebarGroup>
                        <SidebarGroupLabel>Profile</SidebarGroupLabel>
                        <SidebarMenu>
                            {profileItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
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
        <Sidebar collapsible="icon" variant="sidebar">
            {sidebarContent}
            <SidebarRail />
        </Sidebar>
    )
}
