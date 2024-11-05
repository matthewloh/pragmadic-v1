import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AnalyticsLoading() {
    return (
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
                {/* Stats loading */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="p-4">
                            <Skeleton className="mb-2 h-4 w-32" />
                            <Skeleton className="h-8 w-20" />
                        </Card>
                    ))}
                </div>

                {/* Tabs loading */}
                <Card className="p-4">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-[300px]" />
                        <Skeleton className="h-[400px] w-full" />
                    </div>
                </Card>
            </div>

            {/* Chat loading */}
            <div className="lg:col-span-1">
                <Card className="h-full space-y-4 p-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-20" />
                    </div>
                </Card>
            </div>
        </div>
    )
}
