"use client"

import { Button } from "@/components/ui/button"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useUpload } from "@supabase-cache-helpers/storage-react-query"
import useSupabaseBrowser from "@/utils/supabase/client"
import { generateEmbeddingsForPdfAction } from "../actions/upload-file"

interface FileUploadProps {
    folder: string
}

export function FileUpload({ folder }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const supabase = useSupabaseBrowser()

    const { mutateAsync: upload, isPending } = useUpload(
        supabase.storage.from("knowledge_base"),
        {
            buildFileName: ({ fileName }) => `${folder}/${fileName}`,
        },
    )

    const resetUpload = () => {
        setFile(null)
        setIsProcessing(false)
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length) {
            setFile(acceptedFiles[0])
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
            "text/plain": [".txt"],
        },
    })

    const handleUpload = async () => {
        if (!file || !folder) return

        try {
            setIsProcessing(true)

            // Upload to Supabase
            const uploadResult = await upload({ files: [file] })
            const result = uploadResult[0]

            if (result.error) {
                throw new Error(`Upload failed: ${result.error.message}`)
            }

            if (!result.data) {
                throw new Error("Upload failed: No data returned")
            }

            // Pass the object ID from the upload result
            await generateEmbeddingsForPdfAction(
                result.data.fullPath,
                folder,
                result.data.id,
            )
            toast.success("File processed successfully")
            resetUpload()
        } catch (error) {
            console.error("Upload error:", error)
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to process file",
            )
            resetUpload()
        }
    }

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "relative rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-colors",
                    isDragActive && "border-muted-foreground/50",
                    file && "border-muted-foreground/50",
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="flex items-center justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-muted-foreground">
                        {isDragActive ? (
                            <p>Drop the file here</p>
                        ) : file ? (
                            <div className="flex items-center gap-2">
                                <span>{file.name}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        resetUpload()
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <p>
                                    Drag & drop a file here, or click to select
                                </p>
                                <p className="text-sm">
                                    Supported files: PDF, DOC, DOCX, TXT
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Button
                onClick={handleUpload}
                disabled={!file || isPending || isProcessing}
                className="w-full"
            >
                {isPending || isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isPending ? "Uploading..." : "Processing..."}
                    </>
                ) : (
                    <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload File
                    </>
                )}
            </Button>
        </div>
    )
}
