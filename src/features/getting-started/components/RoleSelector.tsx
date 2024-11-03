"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Globe2, Building2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function RoleSelector() {
    const router = useRouter()
    const [selected, setSelected] = useState<"nomad" | "owner">()

    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Choose Your Path
                </CardTitle>
                <p className="text-muted-foreground">
                    Select how you&apos;d like to use Pragmadic
                </p>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    className="grid gap-4"
                    value={selected}
                    onValueChange={(value: "nomad" | "owner") =>
                        setSelected(value)
                    }
                >
                    <div>
                        <RadioGroupItem
                            value="nomad"
                            id="nomad"
                            className="peer sr-only"
                        />
                        <Label htmlFor="nomad" className="cursor-pointer">
                            <Card
                                className={cn(
                                    "border-2 transition-all hover:border-primary/50",
                                    selected === "nomad"
                                        ? "border-primary bg-primary/5"
                                        : "border-muted",
                                )}
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Globe2
                                            className={cn(
                                                "h-6 w-6 transition-colors",
                                                selected === "nomad"
                                                    ? "text-primary"
                                                    : "text-muted-foreground",
                                            )}
                                        />
                                        <CardTitle>Digital Nomad</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Join as a digital nomad to discover
                                        events, connect with local communities,
                                        and find the best places to work and
                                        network in Penang.
                                    </p>
                                </CardContent>
                            </Card>
                        </Label>
                    </div>

                    <div>
                        <RadioGroupItem
                            value="owner"
                            id="owner"
                            className="peer sr-only"
                        />
                        <Label htmlFor="owner" className="cursor-pointer">
                            <Card
                                className={cn(
                                    "border-2 transition-all hover:border-primary/50",
                                    selected === "owner"
                                        ? "border-primary bg-primary/5"
                                        : "border-muted",
                                )}
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Building2
                                            className={cn(
                                                "h-6 w-6 transition-colors",
                                                selected === "owner"
                                                    ? "text-primary"
                                                    : "text-muted-foreground",
                                            )}
                                        />
                                        <CardTitle>Hub Owner</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Register your business as a DE Rantau
                                        hub to showcase your space, host events,
                                        and connect with digital nomads in your
                                        area.
                                    </p>
                                </CardContent>
                            </Card>
                        </Label>
                    </div>
                </RadioGroup>

                <Button
                    className="mt-6 w-full"
                    disabled={!selected}
                    onClick={() =>
                        router.push(`/getting-started?${selected}=true`)
                    }
                >
                    Continue as{" "}
                    {selected === "nomad" ? "Digital Nomad" : "Hub Owner"}
                </Button>
            </CardContent>
        </Card>
    )
}
