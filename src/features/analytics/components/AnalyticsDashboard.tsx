"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { EventsChart } from "../charts/events-chart"
import { MemberDistributionChart } from "../charts/member-distribution-chart"
import { OccupationsChart } from "../charts/occupations-chart"
import { SentimentChart } from "../charts/sentiment-chart"
import { AnalyticsChat } from "./AnalyticsChat"
import { AnalyticsStats } from "./AnalyticsStats"

export function AnalyticsDashboard() {
    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="h-full rounded-lg"
        >
            {/* Main Analytics Panel */}
            <ResizablePanel defaultSize={70} minSize={50} maxSize={80}>
                <ScrollArea className="h-full">
                    <div className="space-y-4 p-6">
                        <h1 className="text-2xl font-bold">
                            Analytics Dashboard
                        </h1>
                        <AnalyticsStats />

                        <div className="grid gap-4 md:grid-cols-2">
                            <MemberDistributionChart />
                            <OccupationsChart />
                        </div>

                        <Tabs defaultValue="occupations" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="occupations">
                                    Occupations
                                </TabsTrigger>
                                <TabsTrigger value="sentiment">
                                    Sentiment
                                </TabsTrigger>
                                <TabsTrigger value="events">Events</TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="occupations"
                                className="space-y-4"
                            >
                                <Card className="p-4">
                                    <h2 className="font-semibold">
                                        Member Occupations Distribution
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Breakdown of professional backgrounds in
                                        your hub
                                    </p>
                                </Card>
                                <OccupationsChart />
                            </TabsContent>

                            <TabsContent
                                value="sentiment"
                                className="space-y-4"
                            >
                                <Card className="p-4">
                                    <h2 className="font-semibold">
                                        Sentiment Analysis
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Member sentiment trends over time
                                    </p>
                                </Card>
                                <SentimentChart />
                            </TabsContent>

                            <TabsContent value="events" className="space-y-4">
                                <Card className="p-4">
                                    <h2 className="font-semibold">
                                        Event Performance
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Analysis of event attendance and
                                        engagement
                                    </p>
                                </Card>
                                <EventsChart />
                            </TabsContent>
                        </Tabs>
                    </div>
                </ScrollArea>
            </ResizablePanel>

            {/* Resizable Handle */}
            <ResizableHandle withHandle />

            {/* Chat Panel */}
            <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                <Card className="h-full rounded-none border-0">
                    <AnalyticsChat />
                </Card>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
