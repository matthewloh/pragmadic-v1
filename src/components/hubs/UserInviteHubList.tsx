"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    useQuery,
    useUpsertMutation,
} from "@supabase-cache-helpers/postgrest-react-query"
import { toast } from "sonner"
import {
    CheckCircle,
    XCircle,
    Clock,
    UserPlus,
    Shield,
    Users,
    ChevronDown,
    MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SelectUser, UsersToHub } from "@/lib/db/schema"
import { InviteStatus } from "@/lib/db/shared-enums/invites"
import useSupabaseBrowser from "@/utils/supabase/client"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function UserInviteHubList({ invites }: { invites: UsersToHub[] }) {
    const supabase = useSupabaseBrowser()
    const router = useRouter()

    const { mutateAsync: update } = useUpsertMutation(
        supabase.from("users_to_hubs") as any,
        ["id"],
        "user_id",
        {
            onSuccess: () => console.log("Success!"),
        },
    )

    const handleResponse = async (
        invite: UsersToHub,
        response: InviteStatus,
        role?: string,
    ) => {
        try {
            await update({
                // @ts-expect-error GenericTable weird mismatch version
                hub_id: invite.hub_id,
                user_id: invite.user_id,
                invite_status: response,
                invite_role_type: role || invite.invite_role_type,
            })
            toast.success(
                role
                    ? `Role updated to ${role}`
                    : `Invitation status changed to ${response}`,
            )
            router.refresh()
        } catch (error) {
            console.error(`Failed to update:`, error)
            toast.error(`Failed to update`)
        }
    }

    // Separate members and invitations
    const members = invites.filter((i) => i.invite_status === "accepted")
    const pendingInvites = invites.filter((i) => i.invite_status === "pending")
    const rejectedInvites = invites.filter(
        (i) => i.invite_status === "rejected",
    )

    if (!invites?.length) {
        return <EmptyState />
    }

    return (
        <div className="space-y-6">
            {/* Members Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Members</h2>
                    <Badge variant="secondary" className="font-mono">
                        {members.length} total
                    </Badge>
                </div>
                <Card>
                    <ScrollArea className="h-[300px]">
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                {members.map((member) => (
                                    <MemberCard
                                        key={member.user_id}
                                        member={member}
                                        onResponse={handleResponse}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </ScrollArea>
                </Card>
            </section>

            <Separator className="my-6" />

            {/* Invitations Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Invitations</h2>
                    <Badge variant="secondary" className="font-mono">
                        {pendingInvites.length} pending
                    </Badge>
                </div>

                {/* Pending Invites */}
                <Collapsible defaultOpen>
                    <Card>
                        <CollapsibleTrigger className="w-full">
                            <CardHeader className="flex flex-row items-center justify-between p-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-yellow-500" />
                                    <div className="text-left">
                                        <CardTitle>
                                            Pending Invitations
                                        </CardTitle>
                                        <CardDescription>
                                            Awaiting response from users
                                        </CardDescription>
                                    </div>
                                </div>
                                <ChevronDown className="ui-expanded:rotate-180 h-4 w-4 text-muted-foreground transition-all" />
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent className="p-4 pt-0">
                                <div className="space-y-4">
                                    {pendingInvites.map((invite) => (
                                        <InviteCard
                                            key={invite.user_id}
                                            invite={invite}
                                            onResponse={handleResponse}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>

                {/* Rejected Invites */}
                {rejectedInvites.length > 0 && (
                    <Collapsible>
                        <Card>
                            <CollapsibleTrigger className="w-full">
                                <CardHeader className="flex flex-row items-center justify-between p-4">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-5 w-5 text-destructive" />
                                        <div className="text-left">
                                            <CardTitle>
                                                Rejected Invitations
                                            </CardTitle>
                                            <CardDescription>
                                                Previously declined invites
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <ChevronDown className="ui-expanded:rotate-180 h-4 w-4 text-muted-foreground transition-all" />
                                </CardHeader>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className="p-4 pt-0">
                                    <div className="space-y-4">
                                        {rejectedInvites.map((invite) => (
                                            <InviteCard
                                                key={invite.user_id}
                                                invite={invite}
                                                onResponse={handleResponse}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>
                )}
            </section>
        </div>
    )
}

function MemberCard({
    member,
    onResponse,
}: {
    member: UsersToHub
    onResponse: (
        invite: UsersToHub,
        status: InviteStatus,
        role?: string,
    ) => void
}) {
    const supabase = useSupabaseBrowser()
    const { data } = useQuery(
        supabase.from("users").select("*").eq("id", member.user_id).single(),
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
                            `https://avatar.vercel.sh/${member.user_id}`
                        }
                    />
                    <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium">{user.display_name}</p>
                    <div className="flex items-center gap-2">
                        <Select
                            defaultValue={member.invite_role_type!}
                            onValueChange={(value) =>
                                onResponse(member, "accepted", value)
                            }
                        >
                            <SelectTrigger className="h-7 w-[110px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">
                                    <span className="flex items-center gap-2">
                                        <Shield className="h-3 w-3 text-blue-500" />
                                        Admin
                                    </span>
                                </SelectItem>
                                {/* <SelectItem value="owner">
                                    <span className="flex items-center gap-2">
                                        <Shield className="h-3 w-3 text-purple-500" />
                                        Owner
                                    </span>
                                </SelectItem> */}
                                <SelectItem value="member">
                                    <span className="flex items-center gap-2">
                                        <Shield className="h-3 w-3 text-green-500" />
                                        Member
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                            onClick={() => onResponse(member, "pending")}
                            className="text-muted-foreground"
                        >
                            <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                            Set Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onResponse(member, "rejected")}
                            className="text-destructive"
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject Member
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onResponse(member, "accepted")}
                            className="text-primary"
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept Member
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

function InviteCard({
    invite,
    onResponse,
}: {
    invite: UsersToHub
    onResponse: (
        invite: UsersToHub,
        status: InviteStatus,
        role?: string,
    ) => void
}) {
    const supabase = useSupabaseBrowser()
    const { data } = useQuery(
        supabase.from("users").select("*").eq("id", invite.user_id).single(),
        {
            staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        },
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
                            `https://avatar.vercel.sh/${user.id}`
                        }
                    />
                    <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium">{user.display_name}</p>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                        {invite.invite_role_type}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {invite.invite_status !== "rejected" && (
                    <Button
                        onClick={() => onResponse(invite, "rejected")}
                        variant="destructive"
                        size="sm"
                    >
                        Reject
                    </Button>
                )}
                {invite.invite_status !== "pending" && (
                    <Button
                        onClick={() => onResponse(invite, "pending")}
                        variant="outline"
                        size="sm"
                    >
                        Reset
                    </Button>
                )}
                {invite.invite_status !== "accepted" && (
                    <Button
                        onClick={() => onResponse(invite, "accepted")}
                        variant="default"
                        size="sm"
                    >
                        Accept
                    </Button>
                )}
            </div>
        </div>
    )
}

function EmptyState() {
    return (
        <Card className="flex items-center justify-center p-6 text-center">
            <CardContent>
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-semibold">No Members Yet</h3>
                <p className="text-sm text-muted-foreground">
                    Start by inviting members to join this hub.
                </p>
            </CardContent>
        </Card>
    )
}
