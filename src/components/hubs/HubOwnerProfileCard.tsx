import { SelectUser } from "@/lib/db/schema"
import { HubOwnerProfile } from "@/lib/db/schema/hubOwnerProfiles"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Building2,
    Copy,
    ExternalLink,
    Globe,
    Mail,
    MapPin,
    Phone,
    Share2,
    User2,
} from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export function HubOwnerProfileCard({
    ownerProfile,
    user,
}: {
    ownerProfile: HubOwnerProfile | null
    user: SelectUser | null
}) {
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied to clipboard!`)
    }

    if (!ownerProfile || !user) {
        return (
            <div className="rounded-lg border bg-card/30 p-6 text-center">
                <User2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">
                    Profile Not Available
                </h3>
                <p className="text-sm text-muted-foreground">
                    The hub owner&apos;s profile is currently being set up.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6 rounded-lg border bg-card/30 p-6">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                        <AvatarImage src={user.image_url || undefined} />
                        <AvatarFallback className="bg-primary/5 text-lg">
                            {user.display_name?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">
                            {user.display_name || "Unnamed Owner"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {ownerProfile.companyName || "Independent Owner"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {ownerProfile.websiteUrl && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            asChild
                        >
                            <Link href={`https://${ownerProfile.websiteUrl}`}>
                                <Globe className="h-4 w-4" />
                                Website
                            </Link>
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() =>
                            copyToClipboard(
                                ownerProfile.businessEmail,
                                "Email address",
                            )
                        }
                    >
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Bio Section */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                    About
                </h3>
                <p className="text-sm leading-relaxed">
                    {ownerProfile.bio ||
                        "This hub owner prefers to maintain an air of mystery... 🎭"}
                </p>
            </div>

            {/* Contact & Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
                {/* Business Details */}
                <div className="space-y-4 rounded-lg border bg-card/50 p-4">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Business Details</h3>
                    </div>
                    {ownerProfile.businessRegistrationNumber && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                Reg. No
                            </span>
                            <Badge variant="outline">
                                {ownerProfile.businessRegistrationNumber}
                            </Badge>
                        </div>
                    )}
                    <div
                        className="flex cursor-pointer items-center justify-between text-sm hover:text-primary"
                        onClick={() =>
                            copyToClipboard(
                                ownerProfile.businessContactNo,
                                "Phone number",
                            )
                        }
                    >
                        <span className="text-muted-foreground">Contact</span>
                        <div className="flex items-center gap-2">
                            <span>{ownerProfile.businessContactNo}</span>
                            <Copy className="h-3 w-3" />
                        </div>
                    </div>
                </div>

                {/* Location Details */}
                <div className="space-y-4 rounded-lg border bg-card/50 p-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-destructive" />
                        <h3 className="font-medium">Locations</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="text-muted-foreground">
                                Business Location
                            </span>
                            <p>{ownerProfile.businessLocation}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">
                                Residing At
                            </span>
                            <p>{ownerProfile.residingLocation}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Links */}
            {ownerProfile.socialMediaHandles && (
                <div className="rounded-lg border bg-card/50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-500" />
                        <h3 className="font-medium">Social Presence</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {ownerProfile.socialMediaHandles}
                    </p>
                </div>
            )}
        </div>
    )
}
