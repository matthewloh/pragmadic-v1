"use client"
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
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useUserRole } from "@/features/auth/hooks/use-user-role" // Import the hook
import { SignOut } from "./SignOutButton"

export default function UserButtonSupabase({
    className,
}: {
    className?: string
}) {
    const { data: { session, user } = {} } = useUserRole() // Destructure session and user directly

    const avatarImageLink =
        user?.user_metadata.avatar_url ??
        user?.user_metadata.picture ??
        `https://avatar.vercel.sh/${user?.user_metadata.full_name}`

    const avatarFallback = user?.user_metadata.full_name
        ?.charAt(0)
        .toUpperCase()

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="relative outline-none">
                <Avatar
                    className={cn(
                        "size-10 cursor-pointer rounded-full transition hover:opacity-75",
                        className,
                    )}
                >
                    <AvatarImage
                        src={avatarImageLink}
                        alt={`${user?.user_metadata.full_name}`}
                    />
                    <AvatarFallback>
                        <span className="text-primary">{avatarFallback}</span>
                    </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom" className="w-60">
                <DropdownMenuLabel>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="truncate">
                                {user?.user_metadata.name}
                            </span>
                            <span className="truncate text-xs font-normal text-[#606060]">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/">Home</Link>
                </DropdownMenuItem>
                <div className="flex flex-row items-center justify-between p-2">
                    <p className="text-sm">Theme</p>
                    <ThemeSwitch />
                </div>
                <DropdownMenuSeparator />
                <SignOut />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
