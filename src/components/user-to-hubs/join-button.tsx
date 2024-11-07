"use client"

import { Button } from "@/components/ui/button"
import { createHubJoinRequestAction } from "@/lib/actions/hubs"
import { toast } from "sonner"

export default function JoinButton({ hubId }: { hubId: string }) {
    const handleJoinHub = async () => {
        const error = await createHubJoinRequestAction(hubId)
        if (error) {
            toast.error(error)
        } else {
            toast.success("Request to join hub sent")
        }
    }
    return <Button onClick={handleJoinHub}>Request to Join Hub</Button>
}
