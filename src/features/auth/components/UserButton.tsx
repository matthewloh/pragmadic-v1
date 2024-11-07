import { ThemeSwitch } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type User } from "@supabase/supabase-js"
import { Home, Sun, UserRound } from "lucide-react"
import Link from "next/link"
import { SignOut } from "./SignOutButton"
import { useCurrentUser } from "../hooks/use-current-user"
import { Skeleton } from "@/components/ui/skeleton"

function UserButtonSkeleton() {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="relative outline-none">
                <Skeleton className="size-10" />
            </DropdownMenuTrigger>
        </DropdownMenu>
    )
}

export default function UserButton() {
    const { data, isPending } = useCurrentUser()
    if (!data) {
        return null
    }
    if (isPending) {
        return <UserButtonSkeleton />
    }
    const { display_name, image_url, email } = data
    if (!display_name) {
        return null
    }
    const avatarFallback = display_name.charAt(0).toUpperCase()
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="relative outline-none">
                <Avatar className="size-10 transition hover:opacity-75">
                    <AvatarImage
                        alt={display_name}
                        src={image_url || ""}
                        className="aspect-square"
                    />
                    <AvatarFallback>
                        <span className="text-primary">{avatarFallback}</span>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" className="w-60">
                <DropdownMenuLabel>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="truncate">{display_name}</span>
                            <span className="truncate text-xs font-normal text-[#606060]">
                                {email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/profile`}>
                        <UserRound className="mr-2 size-4" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                        <Home className="mr-2 size-4" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <div className="flex flex-row items-center justify-between gap-2">
                        <div className="flex flex-row items-center gap-2">
                            <Sun className="size-4" />
                            <p className="text-sm">Theme</p>
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
