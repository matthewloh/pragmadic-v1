import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, Loader, UserRound } from "lucide-react"
import Link from "next/link"
import { useUser } from "../hooks/use-current-user"
import { SignOut } from "./SignOutButton"
import { type User } from "@supabase/supabase-js"

export default function UserButton({ user }: { user: User }) {
    if (!user) {
        return null
    }
    const { user_metadata } = user
    const { full_name, avatar_url } = user_metadata
    if (!full_name) {
        return null
    }
    if (!avatar_url) {
        return null
    }
    const avatarFallback = full_name!.charAt(0).toUpperCase()
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="relative outline-none">
                <Avatar className="size-10 transition hover:opacity-75">
                    <AvatarImage alt={full_name} src={avatar_url} />
                    <AvatarFallback>
                        <span className="text-primary">{avatarFallback}</span>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" className="w-60">
                <DropdownMenuLabel>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="truncate">{full_name}</span>
                            <span className="truncate text-xs font-normal text-[#606060]">
                                {user.email}
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
                <DropdownMenuSeparator />
                <SignOut />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
