"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function HubInviteList({ hubId }: { hubId: string }) {
    const supabase = useSupabaseBrowser()
    const router = useRouter()
    const { data, count, isLoading } = useQuery(
        supabase
            .from("users_to_hubs")
            .select("*, user:users(id, email, display_name)")
            .eq("hub_id", hubId),
        {},
    )

    if (isLoading) {
        return <div>Loading invitations...</div>
    }

    if (!data || data.length === 0) {
        return <div>No invitations found.</div>
    }

    return (
        <div className="space-y-4">
            {data.map((invite) => (
                <Link
                    key={invite.user_id}
                    href={`/hubs/${hubId}/invites/${invite.user_id}`}
                >
                    <Card className="transition-colors hover:bg-accent/50">
                        <CardHeader>
                            <CardTitle>
                                Invite for {invite.user?.display_name}
                            </CardTitle>
                            <CardDescription>
                                Status: {invite.invite_status}
                                <br />
                                Role: {invite.invite_role_type}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Created: {invite.created_at.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
