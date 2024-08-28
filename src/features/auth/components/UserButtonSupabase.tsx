import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { SignOut } from "./SignOutButton"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export default async function UserButtonSupabase() {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    const avatarFallback = user?.user_metadata.full_name
        ?.charAt(0)
        .toUpperCase()
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="relative outline-none">
                <Avatar className="size-10 cursor-pointer rounded-full transition hover:opacity-75">
                    <AvatarImage
                        src={user?.user_metadata.avatar_url}
                        alt={`${user?.user_metadata.full_name}`}
                    />
                    <AvatarFallback>
                        <span className="text-primary">{avatarFallback}</span>
                    </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="w-60">
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
                <DropdownMenuItem>Test</DropdownMenuItem>
                <DropdownMenuSeparator />
                <SignOut />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
