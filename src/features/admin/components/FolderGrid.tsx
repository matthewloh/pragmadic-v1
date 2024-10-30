"use client"

import { Folder } from "lucide-react"
import Link from "next/link"

const KNOWLEDGE_BASE_FOLDERS = [
    {
        id: "de_rantau_visa",
        name: "DE Rantau Visa",
        description: "Visa application and requirements documentation",
    },
    {
        id: "de_rantau_hubs",
        name: "DE Rantau Hubs",
        description: "Information about registered hubs and facilities",
    },
    {
        id: "onboarding",
        name: "Onboarding",
        description: "Digital nomad onboarding materials",
    },
    {
        id: "networking_and_events",
        name: "Networking And Events",
        description: "Community events and networking resources",
    },
]

export function FolderGrid() {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {KNOWLEDGE_BASE_FOLDERS.map((folder) => (
                <Link
                    key={folder.id}
                    href={`/admin/chat/${folder.id}`}
                    className="group relative col-span-2 row-span-2 rounded-lg border p-6 hover:border-foreground/50"
                >
                    <div className="flex grid-rows-2 items-center space-x-3">
                        <Folder className="h-8 w-8 text-muted-foreground group-hover:text-foreground" />
                        <h3 className="text-lg font-semibold tracking-tight">
                            {folder.name}
                        </h3>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        {folder.description}
                    </p>
                </Link>
            ))}
        </div>
    )
}
