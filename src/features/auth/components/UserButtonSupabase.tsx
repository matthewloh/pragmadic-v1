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
import { useUserRole } from "@/features/auth/hooks/use-user-role"
import { SignOut } from "./SignOutButton"
import { SelectUser } from "@/lib/db/schema"

export default function UserButtonSupabase({
    className,
    user,
}: {
    className?: string
    user?: SelectUser
}) {
    const { data: { session } = {} } = useUserRole()

    // Use the image_url from our database user profile
    const avatarImageLink =
        user?.image_url ?? // First try our uploaded profile image
        session?.user?.user_metadata?.avatar_url ?? // Then try OAuth avatar if exists
        session?.user?.user_metadata?.picture ?? // Then try OAuth picture if exists
        `https://api.dicebear.com/7.x/initials/svg?seed=${user?.display_name}` // Fallback to generated avatar

    const avatarFallback = user?.display_name?.charAt(0).toUpperCase() ?? "?"

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
                        alt={user?.display_name ?? "User avatar"}
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
                                {user?.display_name}
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
                <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
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
