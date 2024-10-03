import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Palette,
    SunMoon,
} from "lucide-react"

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
import { useUser } from "@/features/auth/hooks/use-current-user"
import { Skeleton } from "./ui/skeleton"
import Link from "next/link"
import { SignOut } from "@/features/auth/components/SignOutButton"
import { ThemeSwitch } from "./mode-toggle"
import { useUserRole } from "@/features/auth/hooks/use-user-role"

export function NavUser() {
    const { data: user, isPending } = useUser()
    const { isLoading, data } = useUserRole()
    if (!user) {
        return (
            <div className="flex w-full items-center gap-2 px-2 py-1.5">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                    <Skeleton className="mb-1 h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="ml-auto h-4 w-4" />
            </div>
        )
    }
    if (isPending) {
        return (
            <div className="flex w-full items-center gap-2 px-2 py-1.5">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                    <Skeleton className="mb-1 h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="ml-auto h-4 w-4" />
            </div>
        )
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-full rounded-md outline-none ring-ring hover:bg-accent focus-visible:ring-2 data-[state=open]:bg-accent">
                <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm transition-all">
                    <Avatar className="size-10 rounded-full border">
                        <AvatarImage
                            src={user.user_metadata.avatar_url}
                            alt={user.user_metadata.full_name}
                            className="animate-in fade-in-50 zoom-in-90"
                        />
                        <AvatarFallback className="rounded-md">
                            CN
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 leading-none">
                        <div className="font-medium">
                            {user.user_metadata.full_name}
                        </div>
                        <div className="overflow-hidden text-xs text-muted-foreground">
                            <div className="line-clamp-1">{user.email}</div>
                        </div>
                    </div>
                    <ChevronsUpDown className="ml-auto mr-0.5 h-4 w-4 text-muted-foreground/50" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56"
                align="end"
                side="right"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm transition-all">
                        <Avatar className="h-7 w-7 rounded-md">
                            <AvatarImage
                                src={user.user_metadata.avatar_url}
                                alt={user.user_metadata.full_name}
                                className="animate-in fade-in-50 zoom-in-90"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1">
                            <div className="font-medium">
                                {user.user_metadata.full_name}
                            </div>
                            <div className="overflow-hidden text-xs text-muted-foreground">
                                <div className="line-clamp-1">{user.email}</div>
                            </div>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="gap-2" asChild>
                        <Link href="/profile" className="cursor-pointer">
                            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <div className="flex flex-row items-center justify-between p-2">
                        <div className="flex flex-row gap-2">
                            <SunMoon className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">Theme</p>
                        </div>
                        <ThemeSwitch />
                    </div>
                    {data?.role === "admin" && (
                        <DropdownMenuItem className="gap-2" asChild>
                            <Link href="/admin" className="cursor-pointer">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                Admin Panel
                            </Link>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                    <SignOut />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
