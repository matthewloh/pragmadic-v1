import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { inviteUserToEvent } from "@/lib/actions/events"
import { type Hub } from "@/lib/db/schema/hubs"
import { type Event } from "@/lib/db/schema/events"
import { UsersWithInviteStatus } from "@/lib/db/schema"

const inviteFormSchema = z.object({
    userId: z.string().uuid(),
    inviteRoleType: z.enum(["admin", "member"]),
})

type InviteFormValues = z.infer<typeof inviteFormSchema>

interface EventInviteFormProps {
    event: Event
    hub: Hub
    usersToHub: UsersWithInviteStatus[]
}

export function EventInviteForm({
    event,
    hub,
    usersToHub,
}: EventInviteFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<InviteFormValues>({
        resolver: zodResolver(inviteFormSchema),
        defaultValues: {
            userId: "",
            inviteRoleType: "member",
        },
    })

    async function onSubmit(data: InviteFormValues) {
        setIsSubmitting(true)
        try {
            await inviteUserToEvent({
                eventId: event.id,
                userId: data.userId,
                inviteRoleType: data.inviteRoleType,
            })
            toast.success("User invited successfully")
            form.reset()
            router.refresh()
        } catch (error) {
            toast.error("Failed to invite user")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>User</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a user to invite" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {usersToHub.map((userToHub) => (
                                        <SelectItem
                                            key={userToHub.id}
                                            value={userToHub.id}
                                        >
                                            {userToHub.display_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="inviteRoleType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="member">
                                        Member
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Inviting..." : "Invite User"}
                </Button>
            </form>
        </Form>
    )
}
