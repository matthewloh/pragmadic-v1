// Client-side service - database operations moved to API routes

export interface BenchmarkDocument {
    id: string
    name: string
    chunk_count: number | null
    status: string | null
    processed_at: string | null
}

export async function getDocuments(): Promise<BenchmarkDocument[]> {
    try {
        const response = await fetch("/api/benchmark/documents", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })

        if (response.ok) {
            return await response.json()
        } else {
            console.error("Failed to fetch documents:", response.statusText)
            return []
        }
    } catch (error) {
        console.error("Error fetching documents:", error)
        return []
    }
}
