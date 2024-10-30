import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AnalyticsLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        {/* Toolbar loading */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Chart loading */}
        <Card className="p-4">
          <Skeleton className="w-full h-[400px]" />
        </Card>
      </div>
      
      {/* Chat loading */}
      <div className="lg:col-span-1">
        <Card className="h-full p-4 space-y-4">
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
