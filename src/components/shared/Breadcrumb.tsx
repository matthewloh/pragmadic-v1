"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

interface BreadcrumbProps {
    folders: string[]
    basePath: string
}

export function Breadcrumb({ folders, basePath }: BreadcrumbProps) {
    return (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link
                href={basePath}
                className="flex items-center hover:text-foreground"
            >
                <Home className="h-4 w-4" />
            </Link>
            {folders.map((folder, index) => (
                <div key={folder} className="flex items-center">
                    <ChevronRight className="h-4 w-4" />
                    <Link
                        href={`${basePath}/${folders
                            .slice(0, index + 1)
                            .join("/")}`}
                        className="ml-2 hover:text-foreground"
                    >
                        {folder.replace(/_/g, " ")}
                    </Link>
                </div>
            ))}
        </div>
    )
}
