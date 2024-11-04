import { Badge } from "@/components/ui/badge"
import { HubOwnerProfile, SelectUser } from "@/lib/db/schema"
import { CompleteHub } from "@/lib/db/schema/hubs"
import { Globe, Lock, Mail, MapPin, Users } from "lucide-react"
import { HubOwnerProfileCard } from "./HubOwnerProfileCard"

export function HubInfo({
    hub,
    ownerUserProfile,
    hubOwnerProfile,
}: {
    hub: CompleteHub
    ownerUserProfile: SelectUser | null
    hubOwnerProfile: HubOwnerProfile | null
}) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                    {hub.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                    >
                        <MapPin className="h-3 w-3" />
                        {hub.typeOfHub}
                    </Badge>
                    <Badge
                        variant={hub.public ? "secondary" : "destructive"}
                        className="flex items-center gap-1"
                    >
                        {hub.public ? (
                            <Globe className="h-3 w-3" />
                        ) : (
                            <Lock className="h-3 w-3" />
                        )}
                        {hub.public ? "Public" : "Private"}
                    </Badge>
                </div>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground">{hub.description}</p>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Owner Profile</h2>
            <HubOwnerProfileCard
                ownerProfile={hubOwnerProfile}
                user={ownerUserProfile}
            />
            <div className="grid gap-4 sm:grid-cols-1">
                <InfoCard
                    title="Location"
                    value={hub.info || "No address provided"}
                />
            </div>
        </div>
    )
}

function InfoCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="rounded-lg border bg-card p-3">
            <div className="text-sm font-medium text-muted-foreground">
                {title}
            </div>
            <div className="mt-1 text-sm">{value}</div>
        </div>
    )
}

function ContactCard({
    hubOwnerProfile,
}: {
    hubOwnerProfile: HubOwnerProfile | null
}) {
    return (
        <div className="rounded-lg border bg-card/30 p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="h-4 w-4 text-pink-500" />
                Contact Information
            </div>
            <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground/90">
                    {hubOwnerProfile?.businessContactNo ||
                        "No contact information available"}
                </span>
            </div>
        </div>
    )
}
