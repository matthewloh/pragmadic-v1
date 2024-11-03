"use server"

import { createEventMarker } from "@/features/onboarding/map/hub/mutations"
import { createEvent } from "@/lib/api/events/mutations"
import { createHub } from "@/lib/api/hubs/mutations"
import { createRegion } from "@/lib/api/regions/mutations"
import { createState } from "@/lib/api/states/mutations"

export const seedData = async () => {
    try {
        const { region } = await createRegion({
            name: "Northern Region of Malaysia",
            description: "Region comprising of Pulau Pinang",
            public: true,
        })

        const { state } = await createState({
            name: "Pulau Pinang",
            description:
                "State comprising of Pulau Pinang and hubs / communities",
            population: 1000000,
            capitalCity: "Georgetown",
            approvedAt: new Date().toISOString(),
            regionId: region.id,
        })

        const { hub } = await createHub({
            public: true,
            name: "Nomad Hideout",
            description:
                "We're a hub for digital nomads to assimilate in the nomad network of Penang",
            info: "Contact us at nomadhideout@gmail.com",
            typeOfHub: "Coworking Space",
            stateId: state.id,
        })

        const { event } = await createEvent({
            name: "Workshop on how to become a digital nomad",
            description: "Workshop on how to become a digital nomad",
            typeOfEvent: "Workshop",
            startDate: new Date(),
            endDate: new Date(),
            isComplete: false,
            info: "Contact us at nomadhideout@gmail.com",
            hubId: hub.id,
            completionDate: new Date().toISOString(),
        })

        await createEventMarker({
            latitude: "5.4286",
            longitude: "100.3354",
            address: "Nomad Hideout, 123, Jln Gurney, Georgetown, Pulau Pinang",
            venue: "Nomad Hideout",
            eventId: event.id,
            eventType: "Workshop",
            startTime: new Date(),
            endTime: new Date(),
        })

        return { message: "Sample data has been seeded successfully" }
    } catch (error) {
        console.error(error)
        throw new Error("Failed to seed data. Please try again.")
    }
}
