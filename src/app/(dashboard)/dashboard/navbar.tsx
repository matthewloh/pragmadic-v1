import { Button } from "@/components/ui/button"
import { Info, Search } from "lucide-react"
import Link from "next/link"

export function Navbar() {
    return (
        <nav className="flex h-10 items-center justify-between bg-primary p-1.5 text-primary-foreground">
            <div className="flex-1" />
            <div className="max-[642px] min-w-[280px] shrink grow-[2]">
                <Button
                    size={"sm"}
                    className="h-7 w-full justify-start bg-accent/25 px-2 hover:bg-accent/25"
                >
                    <Search className="mr-2 size-4 text-white" />
                    <span className="text-xs text-white">Search workspace</span>
                </Button>
            </div>
            <div className="ml-auto flex flex-1 items-center justify-end">
                <Button variant={"transparent"} size={"iconSm"}>
                    <Info className="size-5 text-white" />
                </Button>
            </div>
        </nav>
    )
}
