"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { seedData } from "@/features/admin/actions/seed"

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
