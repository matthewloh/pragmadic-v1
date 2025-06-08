import { BenchmarkRunner } from "@/features/benchmark/components/BenchmarkRunner"

export default function BenchmarkPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold">
                    RAG & Analytics Benchmark Suite
                </h1>
                <p className="text-muted-foreground">
                    Automated testing for quantitative evaluation of
                    Pragmadic&apos;s RAG Answer Engine and AI-Driven Analytics
                </p>
            </div>
            <BenchmarkRunner />
        </div>
    )
}
