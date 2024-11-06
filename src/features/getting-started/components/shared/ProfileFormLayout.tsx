import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function ProfileFormLayout({
    title,
    subtitle,
    children,
    className,
}: {
    title: string
    subtitle: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className="flex min-h-full items-center justify-center p-4">
            <Card className={cn("w-full max-w-4xl shadow-lg", className)}>
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold">
                        {title}
                    </CardTitle>
                    <p className="text-muted-foreground">{subtitle}</p>
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </div>
    )
}
