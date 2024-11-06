"use client"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AnalyticsToolbarProps {
    selectedView: "occupations" | "sentiment" | "events"
    onViewChange: (view: "occupations" | "sentiment" | "events") => void
}

export function AnalyticsToolbar({
    selectedView,
    onViewChange,
}: AnalyticsToolbarProps) {
    return (
        <div className="flex items-center gap-4">
            <Select
                value={selectedView}
                onValueChange={(value) =>
                    onViewChange(
                        value as "occupations" | "sentiment" | "events",
                    )
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="occupations">Occupations</SelectItem>
                    <SelectItem value="sentiment">
                        Sentiment Analysis
                    </SelectItem>
                    <SelectItem value="events">Event Analysis</SelectItem>
                </SelectContent>
            </Select>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={() => onViewChange("occupations")}
                >
                    Occupations
                </Button>
                <Button
                    variant="outline"
                    onClick={() => onViewChange("sentiment")}
                >
                    Sentiment
                </Button>
                <Button
                    variant="outline"
                    onClick={() => onViewChange("events")}
                >
                    Events
                </Button>
            </div>
        </div>
    )
}
