// Client-side chunk mapping utilities - database operations moved to API routes

interface ChunkMapping {
    chunkId: string
    documentId: string
    content: string
    priority: 'essential' | 'relevant' | 'supplementary'
}

// Mapping of question themes to expected content patterns
const QUESTION_THEME_PATTERNS = {
    eligibility: ['eligibility', 'requirements', 'criteria', 'qualify'],
    fees: ['fee', 'cost', 'payment', 'price', 'charge'],
    validity: ['validity', 'duration', 'period', 'valid', 'expire'],
    extension: ['extension', 'extend', 'renew', 'renewal'],
    documents: ['document', 'documents', 'passport', 'insurance', 'proof'],
    income: ['income', 'salary', 'earning', 'minimum', 'threshold'],
    family: ['family', 'spouse', 'children', 'dependent', 'child'],
    application: ['application', 'apply', 'submit', 'evisa', 'embassy'],
    rejection: ['rejection', 'reject', 'appeal', 'refuse', 'deny'],
    employment: ['work', 'employment', 'job', 'company', 'local'],
    banking: ['bank', 'account', 'banking', 'open account'],
    tax: ['tax', 'taxation', 'income tax', 'revenue', 'tax obligation'],
    travel: ['sabah', 'sarawak', 'travel', 'tourist pass', 'state']
}

export class ChunkMapper {
    private static deRantauDocumentId = '10ba6de3-c3b4-4999-86e1-4e0587b397b7'

    /**
     * Fetch and analyze chunks from the DE Rantau FAQ document via API
     */
    static async getAvailableChunks(): Promise<Array<{
        id: string
        content: string
        metadata: any
    }>> {
        try {
            const response = await fetch('/api/benchmark/chunks', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.ok) {
                return await response.json()
            } else {
                console.error('Failed to fetch chunks:', response.statusText)
                return []
            }
        } catch (error) {
            console.error('Error fetching chunks:', error)
            return []
        }
    }

    /**
     * Map question themes to relevant chunks based on content analysis
     */
    static async mapQuestionToChunks(questionTheme: string): Promise<ChunkMapping[]> {
        const chunks = await this.getAvailableChunks()
        const patterns = QUESTION_THEME_PATTERNS[questionTheme as keyof typeof QUESTION_THEME_PATTERNS] || []
        
        const relevantChunks: ChunkMapping[] = []

        for (const chunk of chunks) {
            const content = chunk.content.toLowerCase()
            let relevanceScore = 0
            
            // Count how many patterns match
            for (const pattern of patterns) {
                if (content.includes(pattern.toLowerCase())) {
                    relevanceScore++
                }
            }

            // If we found relevant content, classify the priority
            if (relevanceScore > 0) {
                let priority: 'essential' | 'relevant' | 'supplementary' = 'supplementary'
                
                if (relevanceScore >= 3) {
                    priority = 'essential'
                } else if (relevanceScore >= 2) {
                    priority = 'relevant'
                }

                relevantChunks.push({
                    chunkId: chunk.id,
                    documentId: this.deRantauDocumentId,
                    content: chunk.content.substring(0, 200) + '...',
                    priority
                })
            }
        }

        // Sort by relevance (essential first, then relevant, then supplementary)
        return relevantChunks.sort((a, b) => {
            const priorityOrder = { essential: 0, relevant: 1, supplementary: 2 }
            return priorityOrder[a.priority] - priorityOrder[b.priority]
        })
    }

    /**
     * Get chunk mappings for all test case themes
     */
    static async getAllChunkMappings(): Promise<Record<string, ChunkMapping[]>> {
        const mappings: Record<string, ChunkMapping[]> = {}
        
        for (const theme of Object.keys(QUESTION_THEME_PATTERNS)) {
            mappings[theme] = await this.mapQuestionToChunks(theme)
        }

        return mappings
    }

    /**
     * Validate that chunk IDs exist in the database via API route
     */
    static async validateChunkIds(chunkIds: string[]): Promise<Record<string, boolean>> {
        const validation: Record<string, boolean> = {}
        
        try {
            for (const chunkId of chunkIds) {
                const response = await fetch('/api/benchmark/validate-chunk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chunkId })
                })
                
                if (response.ok) {
                    const { exists } = await response.json()
                    validation[chunkId] = exists
                } else {
                    validation[chunkId] = false
                }
            }
        } catch (error) {
            console.error('Error validating chunk IDs:', error)
            // Mark all as false if there's an error
            chunkIds.forEach(id => validation[id] = false)
        }

        return validation
    }

    /**
     * Get the best chunk ID for a specific question theme
     */
    static async getBestChunkForTheme(theme: string): Promise<string | null> {
        const chunks = await this.mapQuestionToChunks(theme)
        return chunks.length > 0 ? chunks[0].chunkId : null
    }

    /**
     * Update test cases with validated chunk IDs
     */
    static async updateTestCaseChunks(testCases: any[]): Promise<any[]> {
        const allMappings = await this.getAllChunkMappings()
        
        return testCases.map(testCase => {
            const questionId = testCase.id
            let theme = ''
            
            // Determine theme based on question content
            const question = testCase.question.toLowerCase()
            if (question.includes('eligibility') || question.includes('requirements')) theme = 'eligibility'
            else if (question.includes('cost') || question.includes('fee')) theme = 'fees'
            else if (question.includes('valid') || question.includes('long')) theme = 'validity'
            else if (question.includes('extend')) theme = 'extension'
            else if (question.includes('documents') || question.includes('need')) theme = 'documents'
            else if (question.includes('income')) theme = 'income'
            else if (question.includes('family') || question.includes('spouse')) theme = 'family'
            else if (question.includes('apply') || question.includes('where')) theme = 'application'
            else if (question.includes('reject')) theme = 'rejection'
            else if (question.includes('work') || question.includes('company')) theme = 'employment'
            else if (question.includes('bank')) theme = 'banking'
            else if (question.includes('tax')) theme = 'tax'
            else if (question.includes('sabah') || question.includes('sarawak')) theme = 'travel'

            // Update chunk IDs if we have mappings for this theme
            if (theme && allMappings[theme]) {
                const relevantMappings = allMappings[theme].slice(0, 2) // Take top 2 most relevant
                testCase.groundTruth.expectedChunks = relevantMappings.map(mapping => ({
                    chunkId: mapping.chunkId,
                    documentId: mapping.documentId,
                    priority: mapping.priority
                }))
            }

            return testCase
        })
    }
} 