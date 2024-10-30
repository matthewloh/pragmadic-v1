import { pgEnum } from "drizzle-orm/pg-core"
import { EVENT_TYPES } from "@/features/events/types"

export const eventTypeEnum = pgEnum(
    "event_type",
    Object.values(EVENT_TYPES) as [string, ...string[]],
)

export type EVENT_TYPE = (typeof eventTypeEnum.enumValues)[number]
