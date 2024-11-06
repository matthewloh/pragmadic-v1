import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { type Hub } from "@/lib/db/schema/hubs"

interface HubSelectorProps {
    hubs: Hub[]
    selectedHubId: string
    onHubChange: (hubId: string) => void
}

export function HubSelector({ hubs, selectedHubId, onHubChange }: HubSelectorProps) {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <Select value={selectedHubId} onValueChange={onHubChange}>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a hub to view" />
                </SelectTrigger>
                <SelectContent>
                    {hubs.map((hub) => (
                        <SelectItem key={hub.id} value={hub.id}>
                            {hub.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
} 