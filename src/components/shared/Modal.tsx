import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function Modal({
    title,
    open,
    setOpen,
    children,
}: {
    title?: string
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    children: React.ReactNode
}) {
    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogContent className="w-[90vw] max-w-[750px] overflow-hidden rounded-lg p-0 sm:w-full">
                <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
                    <DialogTitle className="text-lg font-semibold text-primary sm:text-xl">
                        {title ?? "Modal"}
                    </DialogTitle>
                </DialogHeader>
                <div className="max-h-[80vh] overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}
