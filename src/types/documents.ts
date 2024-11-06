export type ReferencedDocument = {
    id: string
    title: string
    content: string
    relevance: number
}

export type DocumentFolder = {
    id: string
    name: string
    parent_id: string | null
    created_at: string
    updated_at: string
}

export type Document = {
    id: string
    title: string
    content: string
    folder_id: string | null
    created_at: string
    updated_at: string
    metadata?: Record<string, any>
}
