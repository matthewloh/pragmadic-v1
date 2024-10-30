import { pgTable, serial, varchar, doublePrecision } from "drizzle-orm/pg-core"

export const markers = pgTable("markers", {
    id: serial("id").primaryKey(),
    type: varchar("type", { length: 255 }).notNull(),
    longitude: doublePrecision("longitude").notNull(),
    latitude: doublePrecision("latitude").notNull(),
})
