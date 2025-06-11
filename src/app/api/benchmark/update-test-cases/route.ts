import { NextResponse } from "next/server"
import { updateTestCasesAPI } from "@/features/benchmark/utils/updateTestCases"

export async function POST() {
    try {
        const result = await updateTestCasesAPI()
        return NextResponse.json(result)
    } catch (error) {
        console.error("Error updating test cases:", error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
                message: "Failed to update test cases",
            },
            { status: 500 },
        )
    }
}
