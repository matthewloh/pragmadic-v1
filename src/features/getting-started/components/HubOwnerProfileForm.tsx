"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createHubOwnerProfileAction } from "@/lib/actions/hubOwnerProfiles"
import { insertHubOwnerProfileParams } from "@/lib/db/schema/hubOwnerProfiles"
import { toast } from "sonner"
import { db } from "@/lib/db"
import { userRoles } from "@/lib/db/schema"
import { assignUserRoleAction } from "@/features/auth/actions/roles"

export function GettingStartedOwnerProfileForm({ userId }: { userId: string }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const form = useForm({
        resolver: zodResolver(insertHubOwnerProfileParams),
        defaultValues: {
            companyName: "",
            businessRegistrationNumber: "",
            bio: "",
            businessContactNo: "",
            businessEmail: "",
            businessLocation: "",
            residingLocation: "",
            socialMediaHandles: "",
            websiteUrl: "",
        },
    })

    async function onSubmit(data: z.infer<typeof insertHubOwnerProfileParams>) {
        startTransition(async () => {
            try {
                // Create hub owner profile
                const profileError = await createHubOwnerProfileAction({
                    ...data,
                })

                if (profileError) {
                    toast.error(profileError)
                    return
                }

                // Assign owner role
                const roleError = await assignUserRoleAction({
                    userId,
                    role: "owner",
                })

                if (roleError) {
                    toast.error(roleError)
                    return
                }

                toast.success("Profile created successfully!")
                router.push("/dashboard")
            } catch (error) {
                toast.error("Something went wrong")
                console.error(error)
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Complete Your Hub Owner Profile
                </CardTitle>
                <p className="text-muted-foreground">
                    Tell us about your business to get started with DE Rantau
                </p>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                                {...form.register("companyName")}
                                placeholder="Your business name"
                            />
                            {form.formState.errors.companyName && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.companyName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="businessRegistrationNumber">
                                Business Registration Number
                            </Label>
                            <Input
                                {...form.register("businessRegistrationNumber")}
                                placeholder="e.g., SSM number"
                            />
                            {form.formState.errors
                                .businessRegistrationNumber && (
                                <p className="text-sm text-destructive">
                                    {
                                        form.formState.errors
                                            .businessRegistrationNumber.message
                                    }
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Business Description</Label>
                        <Textarea
                            {...form.register("bio")}
                            placeholder="Tell us about your business, facilities, and what makes it perfect for digital nomads..."
                            className="min-h-[100px]"
                        />
                        {form.formState.errors.bio && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.bio.message}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="businessContactNo">
                                Business Contact
                            </Label>
                            <Input
                                {...form.register("businessContactNo")}
                                placeholder="Business phone number"
                            />
                            {form.formState.errors.businessContactNo && (
                                <p className="text-sm text-destructive">
                                    {
                                        form.formState.errors.businessContactNo
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="businessEmail">
                                Business Email
                            </Label>
                            <Input
                                {...form.register("businessEmail")}
                                type="email"
                                placeholder="business@example.com"
                            />
                            {form.formState.errors.businessEmail && (
                                <p className="text-sm text-destructive">
                                    {
                                        form.formState.errors.businessEmail
                                            .message
                                    }
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="businessLocation">
                                Business Location
                            </Label>
                            <Input
                                {...form.register("businessLocation")}
                                placeholder="Full address of your business"
                            />
                            {form.formState.errors.businessLocation && (
                                <p className="text-sm text-destructive">
                                    {
                                        form.formState.errors.businessLocation
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="residingLocation">
                                Residing Location
                            </Label>
                            <Input
                                {...form.register("residingLocation")}
                                placeholder="Your current residence address"
                            />
                            {form.formState.errors.residingLocation && (
                                <p className="text-sm text-destructive">
                                    {
                                        form.formState.errors.residingLocation
                                            .message
                                    }
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="socialMediaHandles">
                                Social Media
                            </Label>
                            <Input
                                {...form.register("socialMediaHandles")}
                                placeholder="Your business social media handles"
                            />
                            {form.formState.errors.socialMediaHandles && (
                                <p className="text-sm text-destructive">
                                    {
                                        form.formState.errors.socialMediaHandles
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="websiteUrl">Website</Label>
                            <Input
                                {...form.register("websiteUrl")}
                                placeholder="https://your-business.com"
                            />
                            {form.formState.errors.websiteUrl && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.websiteUrl.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? "Creating Profile..." : "Complete Setup"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
