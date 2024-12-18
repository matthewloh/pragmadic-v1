"use client"

import EventList from "@/components/events/EventList"
import { UserInviteHubList } from "@/components/hubs/UserInviteHubList"
import ReviewList from "@/components/reviews/ReviewList"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    HubOwnerProfile,
    SelectUser,
    UsersWithInviteStatus,
} from "@/lib/db/schema"
import { CompleteEvent } from "@/lib/db/schema/events"
import { CompleteHub } from "@/lib/db/schema/hubs"
import { CompleteReview } from "@/lib/db/schema/reviews"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Calendar, Info, Star, Users } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { HubInfo } from "./HubInfo"
import useSupabaseBrowser from "@/utils/supabase/client"

interface HubTabsProps {
    hub: CompleteHub
    ownerUserProfile: SelectUser | null
    hubOwnerProfile: HubOwnerProfile | null
    events: CompleteEvent[]
    reviews: CompleteReview[]
    usersToHub: UsersWithInviteStatus[]
    tab: string
}

export function HubTabs({
    hub,
    ownerUserProfile,
    hubOwnerProfile,
    events,
    reviews,
    usersToHub,
    tab,
}: HubTabsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState(tab || "info")
    const tabContent = {
        info: (
            <HubInfo
                hub={hub}
                ownerUserProfile={ownerUserProfile}
                hubOwnerProfile={hubOwnerProfile}
            />
        ),
        events: <EventList hubs={[hub]} hubId={hub.id} events={events} />,
        reviews: <ReviewList hubs={[hub]} hubId={hub.id} reviews={reviews} />,
        members: <UserInviteHubList invites={usersToHub} hub={hub} />,
    }

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        const params = new URLSearchParams(searchParams)
        params.set("tab", value)
        router.push(`/hubs/${hub.id}?${params.toString()}`, {
            scroll: false,
        })
    }

    return (
        <div className="mt-6 rounded-lg border bg-card/30 p-1">
            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-4 gap-2 rounded-md bg-muted/50 p-1">
                    <TabButton
                        value="info"
                        icon={<Info />}
                        label="Info"
                        isActive={activeTab === "info"}
                    />
                    <TabButton
                        value="events"
                        icon={<Calendar />}
                        label="Events"
                        isActive={activeTab === "events"}
                    />
                    <TabButton
                        value="reviews"
                        icon={<Star />}
                        label="Reviews"
                        isActive={activeTab === "reviews"}
                    />
                    <TabButton
                        value="members"
                        icon={<Users />}
                        label="Members"
                        isActive={activeTab === "members"}
                    />
                </TabsList>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut",
                        }}
                    >
                        <TabsContent
                            value={activeTab}
                            className="mt-6 rounded-lg border bg-card/50 p-4"
                        >
                            <Card className="border-0 bg-transparent shadow-none">
                                <CardContent className="p-6">
                                    <ScrollArea className="h-[calc(100vh-24rem)] rounded-md px-4">
                                        <div className="pr-4">
                                            {
                                                tabContent[
                                                    activeTab as keyof typeof tabContent
                                                ]
                                            }
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </motion.div>
                </AnimatePresence>
            </Tabs>
        </div>
    )
}

const TabButton = ({
    value,
    icon,
    label,
    isActive,
}: {
    value: string
    icon: React.ReactNode
    label: string
    isActive: boolean
}) => (
    <TabsTrigger
        value={value}
        className={cn(
            "group relative flex items-center gap-2 rounded-md border transition-all",
            "data-[state=active]:border-primary/20 data-[state=active]:bg-background",
            "data-[state=active]:shadow-sm",
            "hover:bg-background/80",
        )}
    >
        <div>
            <span
                className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                    "group-hover:text-primary/80",
                )}
            >
                {icon}
            </span>
        </div>
        <span
            className={cn(
                "hidden sm:inline",
                isActive ? "text-foreground" : "text-muted-foreground",
            )}
        >
            {label}
        </span>
        {isActive && (
            <motion.div
                className="absolute -bottom-[1px] left-0 right-0 h-[2px] rounded-full bg-primary"
                layoutId="activeTab"
                transition={{ type: "spring", duration: 0.5 }}
            />
        )}
    </TabsTrigger>
)
