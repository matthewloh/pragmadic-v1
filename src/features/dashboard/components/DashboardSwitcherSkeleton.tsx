export function DashboardSwitcherSkeleton() {
    return (
        <div className="relative min-h-screen w-full">
            <div className="sticky top-0 z-50 w-full bg-background/95 px-4 py-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Previous Button Skeleton */}
                    <div className="h-10 w-[120px] animate-pulse rounded-md bg-muted" />

                    {/* Title and Role Selector Skeleton */}
                    <div className="text-center">
                        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                        <div className="mt-2 h-8 w-64 animate-pulse rounded bg-muted" />
                        <div className="mx-auto mt-4 h-10 w-[180px] animate-pulse rounded bg-muted" />
                    </div>

                    {/* Next Button Skeleton */}
                    <div className="h-10 w-[120px] animate-pulse rounded-md bg-muted" />
                </div>
            </div>

            {/* Dashboard Content Skeleton */}
            <div className="relative mx-auto mt-8 grid w-full gap-6 px-4">
                <div className="h-32 animate-pulse rounded-lg bg-muted" />
                <div className="h-48 animate-pulse rounded-lg bg-muted" />
                <div className="h-64 animate-pulse rounded-lg bg-muted" />
            </div>

            {/* Role Indicators Skeleton */}
            <div className="fixed bottom-8 left-1/2 flex -translate-x-1/2 transform space-x-2">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-2 w-2 animate-pulse rounded-full bg-muted"
                    />
                ))}
            </div>
        </div>
    )
}
