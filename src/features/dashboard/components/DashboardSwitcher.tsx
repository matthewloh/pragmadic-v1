"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { UserRole } from "@/lib/auth/utils"
import { SelectUser } from "@/lib/db/schema"

// Component imports
import DashboardAdmin from "./admin/DashboardAdmin"
import DashboardOwner from "./owner/DashboardOwner"
import DashboardNomad from "./nomad/DashboardNomad"
import DashboardRegular from "./regular/DashboardRegular"

// Constants
const DASHBOARD_COMPONENTS = {
    admin: DashboardAdmin,
    owner: DashboardOwner,
    nomad: DashboardNomad,
    regular: DashboardRegular,
} as const

// Animation variants
const dashboardVariants = {
    enter: { opacity: 0, x: 300 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -300 },
}

const dashboardTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
}

// Types
interface DashboardSwitcherProps {
    user: SelectUser
    userRoles: UserRole[]
    defaultRole?: UserRole
}

// Utility functions
const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export default function DashboardSwitcher({
    user,
    userRoles,
    defaultRole,
}: DashboardSwitcherProps) {
    // State
    const [currentRoleIndex, setCurrentRoleIndex] = useState(
        defaultRole ? userRoles.indexOf(defaultRole) : 0,
    )
    const [containerWidth, setContainerWidth] = useState(0)

    // Refs
    const containerRef = useRef<HTMLDivElement>(null)

    // Derived values
    const currentRole = userRoles[currentRoleIndex]
    const CurrentDashboard = DASHBOARD_COMPONENTS[currentRole]
    const isFirstRole = currentRoleIndex === 0
    const isLastRole = currentRoleIndex === userRoles.length - 1
    const previousRole = !isFirstRole
        ? capitalizeFirstLetter(userRoles[currentRoleIndex - 1])
        : null
    const nextRole = !isLastRole
        ? capitalizeFirstLetter(userRoles[currentRoleIndex + 1])
        : null

    // Effects
    useEffect(() => {
        const updateContainerWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth)
            }
        }

        updateContainerWidth()
        window.addEventListener("resize", updateContainerWidth)
        return () => window.removeEventListener("resize", updateContainerWidth)
    }, [])

    // Handlers
    const handleRoleChange = (value: string) => {
        setCurrentRoleIndex(userRoles.indexOf(value as UserRole))
    }

    const handleDragEnd = (
        _: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo,
    ) => {
        if (info.offset.x > 100 && !isFirstRole) {
            setCurrentRoleIndex(currentRoleIndex - 1)
        } else if (info.offset.x < -100 && !isLastRole) {
            setCurrentRoleIndex(currentRoleIndex + 1)
        }
    }

    return (
        <div className="relative min-h-screen w-full" ref={containerRef}>
            {/* Header Section */}
            <div className="sticky top-0 z-50 w-full bg-background/95 px-4 py-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Previous Button */}
                    <Button
                        variant="outline"
                        onClick={() =>
                            !isFirstRole &&
                            setCurrentRoleIndex(currentRoleIndex - 1)
                        }
                        disabled={isFirstRole}
                        className="min-w-[120px] shrink-0 justify-start"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        {previousRole || "Previous"}
                    </Button>

                    {/* Title and Role Selector */}
                    <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            Today is always the most enjoyable day!
                        </p>
                        <h2 className="mt-2 text-4xl font-bold text-primary">
                            Hello, {user?.display_name || "Nomad"} 👋
                        </h2>
                        <Select
                            value={currentRole}
                            onValueChange={handleRoleChange}
                        >
                            <SelectTrigger className="mx-auto mt-4 w-[180px]">
                                <SelectValue placeholder="Switch Dashboard" />
                            </SelectTrigger>
                            <SelectContent>
                                {userRoles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {capitalizeFirstLetter(role)} Dashboard
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Next Button */}
                    <Button
                        variant="outline"
                        onClick={() =>
                            !isLastRole &&
                            setCurrentRoleIndex(currentRoleIndex + 1)
                        }
                        disabled={isLastRole}
                        className="min-w-[120px] shrink-0 justify-end"
                    >
                        {nextRole || "Next"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="relative mx-auto h-full w-full overflow-hidden px-4">
                <AnimatePresence initial={true} mode="popLayout">
                    <motion.div
                        key={currentRole}
                        initial={dashboardVariants.enter}
                        animate={dashboardVariants.center}
                        exit={dashboardVariants.exit}
                        transition={dashboardTransition}
                        className="w-full"
                    >
                        <CurrentDashboard />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Role Indicators */}
            <div className="fixed bottom-8 left-1/2 flex -translate-x-1/2 transform space-x-2">
                {userRoles.map((role, index) => (
                    <button
                        key={role}
                        onClick={() => setCurrentRoleIndex(index)}
                        className={`h-2 rounded-full transition-all duration-200 ${
                            index === currentRoleIndex
                                ? "w-4 bg-primary"
                                : "w-2 bg-muted hover:bg-muted-foreground"
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}
