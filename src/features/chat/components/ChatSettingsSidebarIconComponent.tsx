import { LucideIcon } from "lucide-react"
import Link from "next/link"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { IconType } from "react-icons/lib"

type ChatSettingsSidebarIconComponentProps = {
    icon: LucideIcon | IconType
    label: string
    href: string
}

export default function ChatSettingsSidebarIconComponent({
    icon: Icon,
    label,
    href,
}: ChatSettingsSidebarIconComponentProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href={`${href}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{label}</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
    )
}
