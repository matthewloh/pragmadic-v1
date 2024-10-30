import { FileStoreActivity } from "@/features/admin/components/FileStoreActivity"
import { type ReactNode, Suspense } from "react"

export default async function Layout({ children }: { children: ReactNode }) {
    return (
        <main className="container flex h-full w-full max-w-[80%] flex-col">
            <Suspense fallback={<div>Loading...</div>}>
                <div className="border-b p-6">
                    <FileStoreActivity />
                </div>
            </Suspense>
            <div className="flex-1 overflow-auto">{children}</div>
        </main>
    )
}
