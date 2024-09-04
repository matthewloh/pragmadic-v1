import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

type SidebarTooltipWrapperProps = {
    children: React.ReactNode
    description: string
}

export default function SidebarTooltipWrapper({
    children,
    description,
}: SidebarTooltipWrapperProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
                {description}
            </TooltipContent>
        </Tooltip>
    )
}
