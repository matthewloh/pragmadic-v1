import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import React from "react"
import { useCurrentUser } from "../hooks/use-current-user"
import { Loader } from "lucide-react"
import { SignOut } from "./SignOutButton"
import Link from "next/link"

export default function UserButton() {
    const { data, isLoading, isFetching } = useCurrentUser()

    if (isLoading || isFetching) {
        return <Loader className="size-4 animate-spin text-muted-foreground" />
    }
    if (!data) {
        return null
    }
    console.log(data)
    const { user_metadata } = data
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
                                {data.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/profile/${data.id}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <SignOut />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
