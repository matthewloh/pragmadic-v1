"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { type UsersToHub } from "@/lib/db/schema/hubs"
import useSupabaseBrowser from "@/utils/supabase/client"
import {
    useInsertMutation,
    useQuery,
    useUpsertMutation,
} from "@supabase-cache-helpers/postgrest-react-query"

type InviteStatus = "pending" | "accepted" | "rejected"

export function HubInviteDetail({ invite }: { invite: UsersToHub }) {
    const router = useRouter()
    const supabase = useSupabaseBrowser()
    const { data, isLoading } = useQuery(
        supabase.from("users").select("*").eq("id", invite.user_id),
        {
            enabled: !!invite.user_id,
        },
    )
    const { mutateAsync: update } = useUpsertMutation(
        supabase.from("users_to_hubs") as any, // TODO weird typing due to version mismatch
        ["id"],
        "user_id",
        {
            onSuccess: () => console.log("Success!"),
        },
    )
    const { mutateAsync: insert } = useInsertMutation(
        supabase.from("users_to_hubs") as any, // TODO GenericTable
        ["id"],
        "user_id",
        {
            onSuccess: () => console.log("Success!"),
        },
    )
    const handleResponse = async (response: InviteStatus) => {
        try {
            await update({
                // @ts-expect-error GenericTable
                hub_id: invite.hub_id,
                user_id: invite.user_id,
                invite_status: response,
            })
            toast.success(`Invitation status changed to ${response}`)
            router.refresh()
            router.push(`/hubs/${invite.hub_id}/invites/${invite.user_id}`)
        } catch (error) {
            console.error(`Failed to update invitation status:`, error)
            toast.error(`Failed to update invitation status`)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Invite Details</CardTitle>
                <CardDescription>
                    Status: {invite.invite_status}
                    <br />
                    Role: {invite.invite_role_type}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>User ID: {invite.user_id}</p>
                <p>Created: {invite.createdAt.toLocaleDateString()}</p>
                <p>Last Updated: {invite.updatedAt.toLocaleDateString()}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
                {invite.invite_status !== "rejected" && (
                    <Button
                        onClick={() => handleResponse("rejected")}
                        variant="outline"
                        disabled={isLoading}
                    >
                        Reject
                    </Button>
                )}
                {invite.invite_status !== "pending" && (
                    <Button
                        onClick={() => handleResponse("pending")}
                        variant="outline"
                        disabled={isLoading}
                    >
                        Reset to Pending
                    </Button>
                )}
                {invite.invite_status !== "accepted" && (
                    <Button
                        onClick={() => handleResponse("accepted")}
                        disabled={isLoading}
                    >
                        Accept
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
