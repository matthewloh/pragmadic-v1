"use client"

import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { SelectUser, UsersWithInviteStatus } from "@/lib/db/schema"

import useSupabaseBrowser from "@/utils/supabase/client"
import { Badge } from "../ui/badge"
export function MemberCardNonAdminView({
    member,
}: {
    member: UsersWithInviteStatus
}) {
    const supabase = useSupabaseBrowser()
    const { data } = useQuery(
        supabase.from("users").select("*").eq("id", member.id).single(),
    )
    if (!data) return null
    const user = data as SelectUser

    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center space-x-4">
                <Avatar>
                    <AvatarImage
                        src={
                            user.image_url ??
                            `https://avatar.vercel.sh/${member.id}`
                        }
                    />
                    <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-start space-y-1">
                    <p className="font-medium">{user.display_name}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                    <Badge className="bg-primary/10 text-sm text-primary">
                        {member.invite_role_type}
                    </Badge>
                </div>
            </div>
        </div>
    )
}
