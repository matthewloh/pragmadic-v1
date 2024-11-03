"use client"

import { Button } from "@/components/ui/button"
import { createHubJoinRequestAction } from "@/lib/actions/hubs"

export default function JoinButton({ hubId }: { hubId: string }) {
    return (
        <Button onClick={async () => await createHubJoinRequestAction(hubId)}>
            Request to Join Hub
        </Button>
    )
}
