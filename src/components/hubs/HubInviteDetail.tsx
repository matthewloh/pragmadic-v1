"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useUserRole } from "@/features/auth/hooks/use-user-role"
import { type UsersToHub } from "@/lib/db/schema/hubs"
import useSupabaseBrowser from "@/utils/supabase/client"
import {
    useDeleteMutation,
    useInsertMutation,
    useQuery,
    useUpsertMutation,
} from "@supabase-cache-helpers/postgrest-react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type InviteStatus = "pending" | "accepted" | "rejected"

const statusStyles = {
    pending:
        "border-l-4 border-l-[#FDB022] bg-[#FDB022]/10 dark:border-l-[#FDB022] dark:bg-[#FDB022]/5",
    accepted:
        "border-l-4 border-l-[#12B76A] bg-[#12B76A]/10 dark:border-l-[#12B76A] dark:bg-[#12B76A]/5",
    rejected:
        "border-l-4 border-l-destructive bg-destructive/10 dark:border-l-destructive dark:bg-destructive/5",
} as const

const statusTextStyles = {
    pending: "text-[#B54708] dark:text-[#FDB022]",
    accepted: "text-[#027A48] dark:text-[#12B76A]",
    rejected: "text-destructive dark:text-destructive",
} as const

export function HubInviteDetail({ invite }: { invite: UsersToHub }) {
    const router = useRouter()
    const supabase = useSupabaseBrowser()
    const { data: sessionData } = useUserRole()
    const user = sessionData?.user
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
    const { mutateAsync: deleteInvite } = useDeleteMutation(
        supabase.from("users_to_hubs") as any, // TODO GenericTable
        ["user_id", "hub_id"],
    )
    const isInvitedUser = user?.id === invite.user_id

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

    const handleDelete = async () => {
        try {
            await supabase
                .from("users_to_hubs")
                .delete()
                .eq("user_id", invite.user_id)
            toast.success("Invite deleted successfully")
            router.refresh()
            router.push(`/hubs/${invite.hub_id}/invites`)
        } catch (error) {
            console.error("Failed to delete invite:", error)
            toast.error("Failed to delete invite")
        }
    }

    return (
        <Card
            className={`${statusStyles[invite.invite_status as InviteStatus]} transition-colors duration-200`}
        >
            <CardHeader>
                <CardTitle>Invite Details</CardTitle>
                <CardDescription
                    className={`font-medium ${statusTextStyles[invite.invite_status as InviteStatus]}`}
                >
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
                {isInvitedUser ? (
                    <Button
                        onClick={handleDelete}
                        variant="destructive"
                        disabled={isLoading}
                    >
                        {invite.invite_status === "pending"
                            ? "Delete Request"
                            : "Delete Invite"}
                    </Button>
                ) : (
                    <>
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
                    </>
                )}
            </CardFooter>
        </Card>
    )
}
