"use client"

import {
    useQuery,
    useUpsertMutation,
} from "@supabase-cache-helpers/postgrest-react-query"
import {
    CheckCircle,
    ChevronDown,
    Clock,
    MoreHorizontal,
    Shield,
    Users,
    XCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useUserRole } from "@/features/auth/hooks/use-user-role"
import { CompleteHub, SelectUser, UsersWithInviteStatus } from "@/lib/db/schema"
import { InviteStatus } from "@/lib/db/shared-enums/invites"
import useSupabaseBrowser from "@/utils/supabase/client"
import JoinButton from "../user-to-hubs/join-button"
import LeaveButton from "../user-to-hubs/leave-button"
import Link from "next/link"

export function UserInviteHubList({
    invites,
    hub,
}: {
    invites: UsersWithInviteStatus[]
    hub: CompleteHub
}) {
    const supabase = useSupabaseBrowser()
    const router = useRouter()

    const { data: userRoleData } = useUserRole()
    const { session, user, user_roles } = userRoleData ?? {}
    const isOwner =
        user_roles?.includes("owner") && session?.user.id === hub.userId
    const isMember = invites.some(
        (i) => i.id === session?.user.id && i.invite_status === "accepted",
    )
    const currentUserStatus = invites.find(
        (i) => i.id === session?.user.id,
    )?.invite_status

    const { mutateAsync: update } = useUpsertMutation(
        supabase.from("users_to_hubs") as any,
        ["hub_id", "user_id"],
        "user_id",
        {
            onSuccess: () => console.log("Success!"),
        },
    )

    const handleResponse = async (
        invite: UsersWithInviteStatus,
        response: InviteStatus,
        role?: string,
    ) => {
        try {
            await update({
                // @ts-expect-error GenericTable weird mismatch version
                hub_id: invite.hub_id,
                user_id: invite.id,
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
        return <EmptyState isOwner={!!isOwner} hubId={hub.id} />
    }

    // If not owner, show restricted view
    if (!isOwner) {
        return (
            <div className="space-y-6">
                <Card className="p-6">
                    <CardHeader>
                        <CardTitle>Hub Membership</CardTitle>
                        <CardDescription>
                            {currentUserStatus === "pending"
                                ? "Your membership request is being reviewed"
                                : !isMember
                                  ? "Join this hub to access member features and connect with others."
                                  : "You are a member of this hub."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isMember ? (
                            <div className="space-y-4">
                                {currentUserStatus === "pending" ? (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            Your request is pending approval
                                            from the hub owner.
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">
                                                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                                                Pending Approval
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleResponse(
                                                        {
                                                            id: session?.user
                                                                .id!,
                                                            hub_id: hub.id,
                                                        } as UsersWithInviteStatus,
                                                        "rejected",
                                                    )
                                                }
                                            >
                                                Cancel Request
                                            </Button>
                                        </div>
                                    </div>
                                ) : currentUserStatus === "rejected" ? (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            Your previous request was not
                                            approved. You can try requesting
                                            again.
                                        </p>
                                        <JoinButton hubId={hub.id} />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-muted-foreground">
                                            Request to join this hub to access
                                            member features.
                                        </p>
                                        <JoinButton hubId={hub.id} />
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            You&apos;re an active member of this
                                            hub.
                                        </p>
                                        <Badge
                                            variant="default"
                                            className="mt-2"
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Active Member
                                        </Badge>
                                    </div>
                                    <LeaveButton hubId={hub.id} />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Original owner view with member management
    return (
        <div className="space-y-6">
            {/* Members Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Manage Members</h2>
                    <Badge variant="secondary" className="font-mono">
                        {members.length} total
                    </Badge>
                </div>
                <Card>
                    <ScrollArea className="h-[300px]">
                        <CardContent className="p-4">
                            {members.length > 0 ? (
                                <div className="space-y-4">
                                    {members.map((member) => (
                                        <MemberCard
                                            key={member.id}
                                            member={member}
                                            onResponse={handleResponse}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex min-h-[200px] flex-col items-center justify-center space-y-3 py-8 text-center">
                                    <div className="rounded-full bg-primary/10 p-3">
                                        <Users className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-medium">
                                            No Active Members
                                        </h3>
                                        <p className="max-w-[200px] text-sm text-muted-foreground">
                                            Accept pending requests or{" "}
                                            <Link
                                                href={`/hubs/${hub.id}/invites`}
                                                className="text-primary underline"
                                            >
                                                invite
                                            </Link>{" "}
                                            new members to grow your hub
                                            community.
                                        </p>
                                    </div>
                                    {pendingInvites.length > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => {
                                                // Scroll to pending invites section
                                                document
                                                    .querySelector(
                                                        "#pending-invites",
                                                    )
                                                    ?.scrollIntoView({
                                                        behavior: "smooth",
                                                    })
                                            }}
                                        >
                                            <Clock className="mr-2 h-4 w-4" />
                                            View {pendingInvites.length} Pending
                                            Request
                                            {pendingInvites.length !== 1
                                                ? "s"
                                                : ""}
                                        </Button>
                                    )}
                                </div>
                            )}
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
                                            These users have requested to join
                                            the hub.
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
                                            key={invite.id}
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
                                                key={invite.id}
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
    member: UsersWithInviteStatus
    onResponse: (
        invite: UsersWithInviteStatus,
        status: InviteStatus,
        role?: string,
    ) => void
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
    invite: UsersWithInviteStatus
    onResponse: (
        invite: UsersWithInviteStatus,
        status: InviteStatus,
        role?: string,
    ) => void
}) {
    const supabase = useSupabaseBrowser()
    const { data } = useQuery(
        supabase.from("users").select("*").eq("id", invite.id).single(),
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

function EmptyState({ isOwner, hubId }: { isOwner: boolean; hubId: string }) {
    if (!isOwner) {
        return (
            <Card className="flex items-center justify-center p-6 text-center">
                <CardContent className="space-y-4">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div>
                        <h3 className="text-lg font-semibold">Join This Hub</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Be the first member to join this hub and connect
                            with others.
                        </p>
                    </div>
                    <JoinButton hubId={hubId} />
                </CardContent>
            </Card>
        )
    }

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
