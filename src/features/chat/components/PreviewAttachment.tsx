import { Attachment } from "ai"
import Image from "next/image"
import { Loader2 } from "lucide-react"

export const PreviewAttachment = ({
    attachment,
    isUploading = false,
}: {
    attachment: Attachment
    isUploading?: boolean
}) => {
    const { name, url, contentType } = attachment

    return (
        <div className="flex max-w-16 flex-col gap-2">
            <div className="relative flex h-20 w-16 flex-col items-center justify-center rounded-md bg-muted">
                {contentType && contentType.startsWith("image") ? (
                    <Image
                        src={url}
                        alt={name ?? "An image attachment"}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl text-muted-foreground">
                        📄
                    </div>
                )}

                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                )}
            </div>

            <div className="max-w-16 truncate text-xs text-muted-foreground">
                {name}
            </div>
        </div>
    )
}
