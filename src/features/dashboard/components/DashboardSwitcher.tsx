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
import DashboardAdmin from "./admin/DashboardAdmin"
import DashboardOwner from "./owner/DashboardOwner"
import DashboardNomad from "./nomad/DashboardNomad"
import DashboardRegular from "./regular/DashboardRegular"
import { UserRole } from "@/lib/auth/utils"
import { SelectUser } from "@/lib/db/schema"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DashboardSwitcherProps {
    user: SelectUser
    userRoles: UserRole[]
    defaultRole?: UserRole
}

const DASHBOARD_COMPONENTS = {
    admin: DashboardAdmin,
    owner: DashboardOwner,
    nomad: DashboardNomad,
    regular: DashboardRegular,
} as const

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export default function DashboardSwitcher({
    user,
    userRoles,
    defaultRole,
}: DashboardSwitcherProps) {
    const [currentRoleIndex, setCurrentRoleIndex] = useState(
        defaultRole ? userRoles.indexOf(defaultRole) : 0,
    )
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(0)

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth)
        }

        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth)
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const currentRole = userRoles[currentRoleIndex]
    const CurrentDashboard = DASHBOARD_COMPONENTS[currentRole]

    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo,
    ) => {
        if (info.offset.x > 100 && currentRoleIndex > 0) {
            setCurrentRoleIndex(currentRoleIndex - 1)
        } else if (
            info.offset.x < -100 &&
            currentRoleIndex < userRoles.length - 1
        ) {
            setCurrentRoleIndex(currentRoleIndex + 1)
        }
    }

    const handlePrevious = () => {
        if (currentRoleIndex > 0) {
            setCurrentRoleIndex(currentRoleIndex - 1)
        }
    }

    const handleNext = () => {
        if (currentRoleIndex < userRoles.length - 1) {
            setCurrentRoleIndex(currentRoleIndex + 1)
        }
    }

    const getPreviousRole = () => {
        if (currentRoleIndex > 0) {
            return capitalizeFirstLetter(userRoles[currentRoleIndex - 1])
        }
        return null
    }

    const getNextRole = () => {
        if (currentRoleIndex < userRoles.length - 1) {
            return capitalizeFirstLetter(userRoles[currentRoleIndex + 1])
        }
        return null
    }

    return (
        <div className="relative min-h-screen w-full" ref={containerRef}>
            {/* Header Section */}
            <div className="sticky top-0 z-50 w-full bg-background/95 px-4 py-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentRoleIndex === 0}
                        className="min-w-[120px] shrink-0 justify-start"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        {getPreviousRole() || "Previous"}
                    </Button>

                    <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            Today is always the most enjoyable day!
                        </p>
                        <h2 className="mt-2 text-4xl font-bold text-primary">
                            Hello, {user?.display_name || "Nomad"} 👋
                        </h2>
                        <Select
                            value={currentRole}
                            onValueChange={(value) =>
                                setCurrentRoleIndex(
                                    userRoles.indexOf(value as UserRole),
                                )
                            }
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

                    <Button
                        variant="outline"
                        onClick={handleNext}
                        disabled={currentRoleIndex === userRoles.length - 1}
                        className="min-w-[120px] shrink-0 justify-end"
                    >
                        {getNextRole() || "Next"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Dashboard Content Section */}
            <div className="relative mx-auto h-full w-full overflow-hidden px-4">
                <AnimatePresence initial={true} mode="popLayout">
                    <motion.div
                        key={currentRole}
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="w-full"
                    >
                        <CurrentDashboard />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dashboard Indicators */}
            <div className="fixed bottom-8 left-1/2 flex -translate-x-1/2 transform space-x-2">
                {userRoles.map((role, index) => (
                    <button
                        key={role}
                        className={`h-2 w-2 rounded-full transition-all duration-200 ${
                            index === currentRoleIndex
                                ? "w-4 bg-primary"
                                : "bg-muted hover:bg-muted-foreground"
                        }`}
                        onClick={() => setCurrentRoleIndex(index)}
                    />
                ))}
            </div>
        </div>
    )
}
