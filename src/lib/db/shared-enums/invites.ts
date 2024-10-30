import { pgEnum } from "drizzle-orm/pg-core"

// Shared enums for invite status, used by community events, hub events
// Communities, hubs.

export const inviteStatusEnum = pgEnum("invite_status", [
    "pending",
    "accepted",
    "rejected",
])

export type InviteStatus = (typeof inviteStatusEnum.enumValues)[number]

export const inviteRoleType = pgEnum("invite_role_type", ["admin", "member"])

export type InviteRoleType = (typeof inviteRoleType.enumValues)[number]
