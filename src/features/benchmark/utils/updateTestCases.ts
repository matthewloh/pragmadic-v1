import { createClient } from "@/utils/supabase/server"

interface ChunkInfo {
    id: string
    content: string
    document_id: string
}

/**
 * Update test cases with current chunk IDs from the database
 * This fixes the precision/recall calculation issue
 */
export async function updateTestCasesWithCurrentChunks() {
    const supabase = await createClient()

    // Get all chunks from the database
    const { data: chunks, error } = await supabase
        .from("document_chunks")
        .select("id, content, document_id")
        .order("document_id")

    if (error) {
        throw new Error(`Failed to fetch chunks: ${error.message}`)
    }

    if (!chunks || chunks.length === 0) {
        throw new Error("No chunks found in database")
    }

    console.log(`Found ${chunks.length} chunks in database`)

    // Map of test case keywords to chunk IDs
    const testCaseChunkMapping = {
        "rag-001": findRelevantChunks(chunks, [
            "DE Rantau Nomad Pass",
            "digital nomads",
            "remote worker",
            "freelancer",
        ]),
        "rag-002": findRelevantChunks(chunks, [
            "eligibility",
            "Tech Talent",
            "Non-Tech Talent",
            "USD24,000",
            "USD60,000",
        ]),
        "rag-003": findRelevantChunks(chunks, [
            "application",
            "apply",
            "online",
            "mdec.my/derantau",
        ]),
        "rag-004": findRelevantChunks(chunks, [
            "processing time",
            "6 to 8 weeks",
            "application process",
        ]),
        "rag-005": findRelevantChunks(chunks, [
            "documents",
            "proof",
            "submission",
            "supporting documents",
        ]),
        "rag-006": findRelevantChunks(chunks, [
            "family",
            "dependent",
            "spouse",
            "child",
            "immediate family",
        ]),
        "rag-007": findRelevantChunks(chunks, [
            "validity",
            "renewal",
            "2 months before",
            "expired",
        ]),
        "rag-008": findRelevantChunks(chunks, [
            "work",
            "spouse work",
            "dependent work",
        ]),
        "rag-009": findRelevantChunks(chunks, [
            "Sabah",
            "Sarawak",
            "Peninsular Malaysia",
            "tourist pass",
        ]),
        "rag-010": findRelevantChunks(chunks, [
            "bank account",
            "banking",
            "financial services",
        ]),
        "rag-011": findRelevantChunks(chunks, [
            "school",
            "education",
            "Student Pass",
            "child attend school",
        ]),
        "rag-012": findRelevantChunks(chunks, [
            "sponsor",
            "sponsoring organization",
            "MDEC sponsor",
        ]),
        "rag-013": findRelevantChunks(chunks, [
            "rejection",
            "appeal",
            "1 month",
            "rejected",
        ]),
        "rag-014": findRelevantChunks(chunks, [
            "fees",
            "cost",
            "payment",
            "RM1,500",
        ]),
        "rag-015": findRelevantChunks(chunks, [
            "tax",
            "taxation",
            "Income Tax Act",
            "withholding tax",
        ]),
    }

    // Generate updated test case configuration
    const updatedMapping = Object.entries(testCaseChunkMapping).map(
        ([testId, chunkIds]) => ({
            testId,
            expectedChunks: chunkIds,
            foundChunks: chunkIds.length,
            sampleContent:
                chunkIds.length > 0
                    ? chunks
                          .find((c) => c.id === chunkIds[0])
                          ?.content.substring(0, 100) + "..."
                    : "No relevant chunks found",
        }),
    )

    console.log("\n=== UPDATED TEST CASE MAPPING ===")
    updatedMapping.forEach((mapping) => {
        console.log(`${mapping.testId}: ${mapping.foundChunks} chunks`)
        console.log(`  Sample: ${mapping.sampleContent}`)
        console.log(
            `  IDs: ${mapping.expectedChunks.slice(0, 3).join(", ")}${mapping.expectedChunks.length > 3 ? "..." : ""}`,
        )
        console.log("")
    })

    return testCaseChunkMapping
}

/**
 * Find chunks that contain relevant keywords for a test case
 */
function findRelevantChunks(chunks: ChunkInfo[], keywords: string[]): string[] {
    const relevantChunks = chunks.filter((chunk) => {
        const content = chunk.content.toLowerCase()
        return keywords.some((keyword) =>
            content.includes(keyword.toLowerCase()),
        )
    })

    // Return up to 5 most relevant chunks
    return relevantChunks.slice(0, 5).map((chunk) => chunk.id)
}

/**
 * Generate TypeScript code for updated test cases
 */
export function generateUpdatedTestCases(
    chunkMapping: Record<string, string[]>,
) {
    const testCaseUpdates = Object.entries(chunkMapping)
        .map(([testId, chunkIds]) => {
            return `    // ${testId}: ${chunkIds.length} expected chunks
    {
        id: "${testId}",
        expectedChunks: [${chunkIds.map((id) => `"${id}"`).join(", ")}],
    }`
        })
        .join(",\n")

    return `// Updated test case chunk mappings (generated ${new Date().toISOString()})
export const UPDATED_CHUNK_MAPPINGS = {
${testCaseUpdates}
}

// Apply these updates to your testCases.ts file in the groundTruth.expectedChunks arrays`
}

/**
 * API endpoint helper to update test cases
 */
export async function updateTestCasesAPI() {
    try {
        const chunkMapping = await updateTestCasesWithCurrentChunks()
        const generatedCode = generateUpdatedTestCases(chunkMapping)

        return {
            success: true,
            mapping: chunkMapping,
            generatedCode,
            message: "Test cases updated successfully",
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to update test cases",
        }
    }
}
