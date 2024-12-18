import {
    BadgeCheck,
    ChevronsUpDown,
    CreditCard,
    HelpCircle,
    LogOut,
    Settings,
    SunMoon,
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOut } from "@/features/auth/components/SignOutButton"
import { useUserRole } from "@/features/auth/hooks/use-user-role"
import { ThemeSwitch } from "./mode-toggle"
import { Skeleton } from "./ui/skeleton"
import { SidebarMenuButton } from "./ui/sidebar"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"

export function NavUser() {
    const { data: user, isPending } = useCurrentUser()
    if (isPending || !user) {
        return (
            <div className="flex w-full items-center gap-2 px-2 py-1.5">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                    <Skeleton className="mb-1 h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="ml-auto h-4 w-4" />
            </div>
        )
    }
    const fullName = user.display_name || "DE Rantau User"
    const initials = fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <Avatar className="h-8 w-8 rounded-full">
                        <AvatarImage
                            src={user.image_url || ""}
                            alt={fullName}
                        />
                        <AvatarFallback className="rounded-full">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                            {fullName}
                        </span>
                        <span className="truncate text-xs">{user.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="right"
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-full">
                            <AvatarImage
                                src={user.image_url || ""}
                                alt={fullName}
                            />
                            <AvatarFallback className="rounded-full">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                                {fullName}
                            </span>
                            <span className="truncate text-xs">
                                {user.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link
                            href="/profile"
                            className="flex cursor-pointer items-center"
                        >
                            <BadgeCheck className="mr-2 h-4 w-4" />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href="/settings"
                            className="flex cursor-pointer items-center"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link
                            href="/help"
                            className="flex cursor-pointer items-center"
                        >
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Help & Support
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <div className="flex w-full flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-2">
                            <SunMoon className="h-4 w-4" />
                            <span>Theme</span>
                        </div>
                        <ThemeSwitch />
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <SignOut />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
