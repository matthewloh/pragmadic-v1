import { Building, Calendar, Mail, Users } from "lucide-react"

export default function ServicesSection() {
    return (
        <section id="services" className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="mb-10 text-center text-3xl font-bold">
                    Our Services for Digital Nomads
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center">
                        <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
                        <h3 className="mb-2 text-xl font-semibold">
                            Community Events
                        </h3>
                        <p>
                            Regular meetups, workshops, and networking sessions
                            for digital nomads in Penang.
                        </p>
                    </div>
                    <div className="text-center">
                        <Building className="mx-auto mb-4 h-12 w-12 text-primary" />
                        <h3 className="mb-2 text-xl font-semibold">
                            DE Rantau Hub Accommodations
                        </h3>
                        <p>
                            Curated list of digital nomad-friendly
                            accommodations and coworking spaces.
                        </p>
                    </div>
                    <div className="text-center">
                        <Calendar className="mx-auto mb-4 h-12 w-12 text-primary" />
                        <h3 className="mb-2 text-xl font-semibold">
                            Visa Renewal Reminders
                        </h3>
                        <p>
                            Timely notifications and assistance for visa
                            renewals and extensions.
                        </p>
                    </div>
                    <div className="text-center">
                        <Mail className="mx-auto mb-4 h-12 w-12 text-primary" />
                        <h3 className="mb-2 text-xl font-semibold">
                            Dedicated Support
                        </h3>
                        <p>
                            Personalized assistance throughout your stay in
                            Malaysia as a digital nomad.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
