import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-20"></div>
                <div className="relative z-10 rounded-full bg-gray-800 p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            </div>
            <h2 className="mt-8 animate-pulse text-2xl font-semibold text-gray-200">
                Loading...
            </h2>
            <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-gray-700">
                <div className="animate-progressBar h-full bg-blue-500"></div>
            </div>
        </div>
    )
}
