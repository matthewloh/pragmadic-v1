"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { assignUserRoleAction } from "@/features/auth/actions/roles"
import { createHubOwnerProfileAction } from "@/lib/actions/hubOwnerProfiles"
import { insertHubOwnerProfileParams } from "@/lib/db/schema/hubOwnerProfiles"
import useSupabaseBrowser from "@/utils/supabase/client"
import { HubOwnerProfileRow } from "@/utils/supabase/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { motion } from "framer-motion"
import {
    Building2,
    FileText,
    Globe,
    Link2,
    Mail,
    MapPin,
    Phone,
} from "lucide-react"
import { useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { ProfileFormLayout } from "./shared/ProfileFormLayout"
import { useQueryClient } from "@tanstack/react-query"

interface GettingStartedOwnerProfileFormProps {
    userId: string
}

export function GettingStartedOwnerProfileForm({
    userId,
}: GettingStartedOwnerProfileFormProps) {
    const supabase = useSupabaseBrowser()
    const [isPending, startTransition] = useTransition()
    const queryClient = useQueryClient()
    // Fetch existing profile
    const {
        data: existingProfile,
        isLoading,
        refetch,
    } = useQuery<HubOwnerProfileRow>(
        supabase
            .from("hub_owner_profiles")
            .select("*")
            .eq("user_id", userId)
            .single(),
    )

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

    // Update form when existing profile is loaded
    useEffect(() => {
        if (existingProfile) {
            form.reset({
                companyName: existingProfile.company_name || "",
                businessRegistrationNumber:
                    existingProfile.business_registration_number || "",
                bio: existingProfile.bio || "",
                businessContactNo: existingProfile.business_contact_no || "",
                businessEmail: existingProfile.business_email || "",
                businessLocation: existingProfile.business_location || "",
                residingLocation: existingProfile.residing_location || "",
                socialMediaHandles: existingProfile.social_media_handles || "",
                websiteUrl: existingProfile.website_url || "",
            })
        }
    }, [existingProfile, form])

    async function onSubmit(data: z.infer<typeof insertHubOwnerProfileParams>) {
        startTransition(async () => {
            try {
                const profileError = await createHubOwnerProfileAction({
                    ...data,
                })

                if (profileError) {
                    toast.error(profileError)
                    return
                }

                // Only assign role if it's a new profile
                const roleError = await assignUserRoleAction({
                    userId,
                    role: "owner",
                })
                queryClient.invalidateQueries({ queryKey: ["user-role"] })

                if (roleError) {
                    toast.error(roleError)
                    return
                }

                toast.success(
                    existingProfile
                        ? "Profile updated successfully!"
                        : "Profile created successfully!",
                )
                refetch()
            } catch (error) {
                toast.error("Something went wrong")
                console.error(error)
            }
        })
    }

    if (isLoading) {
        return (
            <ProfileFormLayout
                title="Loading Profile"
                subtitle="Please wait while we load your profile..."
            >
                <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            </ProfileFormLayout>
        )
    }

    return (
        <ProfileFormLayout
            title={
                existingProfile
                    ? "Update Your Hub Owner Profile"
                    : "Complete Your Hub Owner Profile"
            }
            subtitle={
                existingProfile
                    ? "Review and update your business information"
                    : "Tell us about your business to get started with DE Rantau"
            }
        >
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
            >
                {/* Business Identity */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <Label
                                htmlFor="companyName"
                                className="text-lg font-medium"
                            >
                                Company Name
                            </Label>
                        </div>
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

                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <Label
                                htmlFor="businessRegistrationNumber"
                                className="text-lg font-medium"
                            >
                                Registration Number
                            </Label>
                        </div>
                        <Input
                            {...form.register("businessRegistrationNumber")}
                            placeholder="e.g., SSM number"
                        />
                        {form.formState.errors.businessRegistrationNumber && (
                            <p className="text-sm text-destructive">
                                {
                                    form.formState.errors
                                        .businessRegistrationNumber.message
                                }
                            </p>
                        )}
                    </div>
                </div>

                {/* Business Description */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-primary" />
                        <Label htmlFor="bio" className="text-lg font-medium">
                            Business Description
                        </Label>
                    </div>
                    <Textarea
                        {...form.register("bio")}
                        placeholder="Tell us about your business, facilities, and what makes it perfect for digital nomads..."
                        className="min-h-[120px] resize-none"
                    />
                    {form.formState.errors.bio && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.bio.message}
                        </p>
                    )}
                </div>

                {/* Contact Information */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Phone className="h-5 w-5 text-primary" />
                            <Label
                                htmlFor="businessContactNo"
                                className="text-lg font-medium"
                            >
                                Business Contact
                            </Label>
                        </div>
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

                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Mail className="h-5 w-5 text-primary" />
                            <Label
                                htmlFor="businessEmail"
                                className="text-lg font-medium"
                            >
                                Business Email
                            </Label>
                        </div>
                        <Input
                            {...form.register("businessEmail")}
                            type="email"
                            placeholder="business@example.com"
                        />
                        {form.formState.errors.businessEmail && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.businessEmail.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Locations */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <Label
                                htmlFor="businessLocation"
                                className="text-lg font-medium"
                            >
                                Business Location
                            </Label>
                        </div>
                        <Input
                            {...form.register("businessLocation")}
                            placeholder="Full address of your business"
                        />
                        {form.formState.errors.businessLocation && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.businessLocation.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <Label
                                htmlFor="residingLocation"
                                className="text-lg font-medium"
                            >
                                Residing Location
                            </Label>
                        </div>
                        <Input
                            {...form.register("residingLocation")}
                            placeholder="Your current residence address"
                        />
                        {form.formState.errors.residingLocation && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.residingLocation.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Online Presence */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Globe className="h-5 w-5 text-primary" />
                            <Label
                                htmlFor="socialMediaHandles"
                                className="text-lg font-medium"
                            >
                                Social Media
                            </Label>
                        </div>
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

                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Link2 className="h-5 w-5 text-primary" />
                            <Label
                                htmlFor="websiteUrl"
                                className="text-lg font-medium"
                            >
                                Website
                            </Label>
                        </div>
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

                {/* Update Submit Button */}
                <div className="pt-6">
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <span className="animate-pulse">
                                {existingProfile
                                    ? "Updating Profile..."
                                    : "Creating Profile..."}
                            </span>
                        ) : existingProfile ? (
                            "Update Profile"
                        ) : (
                            "Complete Setup"
                        )}
                    </Button>
                </div>
            </motion.form>
        </ProfileFormLayout>
    )
}
