"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function CommunitySearch({
    onSearch,
}: {
    onSearch: (query: string) => void
}) {
    const [search, setSearch] = useState("")

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearch(query)
        onSearch(query)
    }

    return (
        <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
                type="text"
                placeholder="Search communities..."
                value={search}
                onChange={handleSearch}
                className="pl-10"
            />
        </div>
    )
}
