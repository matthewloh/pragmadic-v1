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
import { useUserRole } from "@/features/auth/hooks/use-user-role"
import { DashboardSwitcherSkeleton } from "./DashboardSwitcherSkeleton"

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
}

// Utility functions
const capitalizeFirstLetter = (string: string | undefined) => {
    if (!string) return ""
    return string.charAt(0).toUpperCase() + string.slice(1)
}

// First, create the skeleton component

export default function DashboardSwitcher({ user }: DashboardSwitcherProps) {
    const { data: userRoleData, isPending } = useUserRole()

    // State
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
    const [containerWidth, setContainerWidth] = useState(0)

    // Refs
    const containerRef = useRef<HTMLDivElement>(null)

    // Get roles from userRoleData with type safety
    const userRoles = userRoleData?.user_roles || []

    // Derived values with null checks
    const currentRole = userRoles[
        currentRoleIndex
    ] as keyof typeof DASHBOARD_COMPONENTS
    const CurrentDashboard = currentRole
        ? DASHBOARD_COMPONENTS[currentRole]
        : DashboardRegular
    const isFirstRole = currentRoleIndex === 0
    const isLastRole = currentRoleIndex === userRoles.length - 1
    const previousRole =
        !isFirstRole && userRoles[currentRoleIndex - 1]
            ? capitalizeFirstLetter(userRoles[currentRoleIndex - 1])
            : null
    const nextRole =
        !isLastRole && userRoles[currentRoleIndex + 1]
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

    // Set initial role when data loads
    useEffect(() => {
        if (userRoleData?.user_roles.length) {
            // Default to first role in the list
            setCurrentRoleIndex(0)
        }
    }, [userRoleData])

    // Handlers
    const handleRoleChange = (value: string) => {
        const newIndex = userRoles.indexOf(value as UserRole)
        if (newIndex !== -1) {
            setCurrentRoleIndex(newIndex)
        }
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
    // Return skeleton while loading or if no roles
    if (isPending || !userRoles.length) {
        return <DashboardSwitcherSkeleton />
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
                        {currentRole && (
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
                                            {capitalizeFirstLetter(role)}{" "}
                                            Dashboard
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
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
