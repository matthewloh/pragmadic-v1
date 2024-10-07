"use client"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Edit,
    Home,
    Layers,
    MapPin,
    Ruler,
    Search,
    Share,
    Trash,
} from "lucide-react"
import { useState } from "react"

export function ToolbarComponent() {
    const tools = [
        { name: "pin", icon: MapPin, tooltip: "Add Pin" },
        { name: "home", icon: Home, tooltip: "Home" },
        { name: "layers", icon: Layers, tooltip: "Layers" },
        { name: "search", icon: Search, tooltip: "Search" },
        { name: "edit", icon: Edit, tooltip: "Edit" },
        { name: "measure", icon: Ruler, tooltip: "Measure" },
        { name: "delete", icon: Trash, tooltip: "Delete" },
        { name: "share", icon: Share, tooltip: "Share" },
    ]
    const [activeToolbar, setActiveToolbar] = useState<string | null>(null)

    const handleToolbarClick = (tool: string) => {
        setActiveToolbar(activeToolbar === tool ? null : tool)
        // Here you would implement the logic for each tool
        console.log(`${tool} tool activated`)
    }
    return (
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform rounded-full bg-white p-2 shadow-lg">
            <TooltipProvider>
                <div className="flex space-x-2 rounded-full bg-white p-2 shadow-lg">
                    {tools.map((tool) => (
                        <Tooltip key={tool.name}>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant={
                                        activeToolbar === tool.name
                                            ? "default"
                                            : "ghost"
                                    }
                                    onClick={() =>
                                        handleToolbarClick(tool.name)
                                    }
                                >
                                    <tool.icon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tool.tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>
        </div>
    )
}
