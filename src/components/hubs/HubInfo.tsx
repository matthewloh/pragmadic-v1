import { Badge } from "@/components/ui/badge"
import { CompleteHub } from "@/lib/db/schema/hubs"
import { MapPin, Globe, Lock } from "lucide-react"

export function HubInfo({ hub }: { hub: CompleteHub }) {
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

            <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                    title="Location"
                    value={hub.stateId || "No address provided"}
                />
                <InfoCard
                    title="Contact"
                    value={hub.stateId || "No contact provided"}
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
