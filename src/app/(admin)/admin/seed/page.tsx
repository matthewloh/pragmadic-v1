"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { seedData } from "@/features/admin/actions/seed"
import { createEventMarker } from "@/features/onboarding/map/hub/mutations"
import { createEvent } from "@/lib/api/events/mutations"
import { createHub } from "@/lib/api/hubs/mutations"
import { createRegion } from "@/lib/api/regions/mutations"
import { createState } from "@/lib/api/states/mutations"
import { toast } from "sonner"

export default function SeedDataPage() {
    return (
        <Card className="mx-auto mt-8 max-w-2xl">
            <CardHeader>
                <CardTitle>Seed Sample Data</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-muted-foreground">
                    This will create a sample region, state, hub, event, and
                    event marker for testing purposes.
                </p>
                <Button
                    onClick={() => {
                        seedData()
                    }}
                >
                    Seed Data
                </Button>
            </CardContent>
        </Card>
    )
}
