import { type HubAnalytics } from "../types"
import { subDays, parseISO, isAfter } from "date-fns"

export function calculateParticipationRate(
    events: HubAnalytics["hub_events"],
): number {
    if (!events || events.length === 0) return 0

    const totalParticipants = events.reduce((acc, event) => {
        const acceptedParticipants =
            event.users_to_events?.filter((user) => user.pending === false)
                .length ?? 0
        const totalInvites = event.users_to_events?.length ?? 0
        return (
            acc + (totalInvites > 0 ? acceptedParticipants / totalInvites : 0)
        )
    }, 0)

    return Math.round((totalParticipants / events.length) * 100)
}

export function calculateMonthlyChange(
    data: HubAnalytics["hub_events"] | HubAnalytics["users_to_hubs"],
): number {
    if (!data || data.length === 0) return 0

    const now = new Date()
    const thirtyDaysAgo = subDays(now, 30)

    const currentPeriod = data.filter((item) => {
        const date = parseISO(item.created_at)
        return isAfter(date, thirtyDaysAgo)
    }).length

    const previousPeriod = data.filter((item) => {
        const date = parseISO(item.created_at)
        return !isAfter(date, thirtyDaysAgo)
    }).length

    if (previousPeriod === 0) return currentPeriod > 0 ? 100 : 0

    return Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100)
}

export function calculateGrowthRate(
    members: HubAnalytics["users_to_hubs"],
): number {
    if (!members || members.length === 0) return 0

    const now = new Date()
    const thirtyDaysAgo = subDays(now, 30)

    const newMembers = members.filter((member) => {
        const joinDate = parseISO(member.created_at)
        return (
            isAfter(joinDate, thirtyDaysAgo) &&
            member.invite_status === "accepted"
        )
    }).length

    const previousMembers = members.filter((member) => {
        const joinDate = parseISO(member.created_at)
        return (
            !isAfter(joinDate, thirtyDaysAgo) &&
            member.invite_status === "accepted"
        )
    }).length

    if (previousMembers === 0) return newMembers > 0 ? 100 : 0

    return Math.round((newMembers / previousMembers) * 100)
}
