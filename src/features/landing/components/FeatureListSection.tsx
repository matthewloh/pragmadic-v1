import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FeatureListSection() {
    return (
        <section className="bg-secondary py-20">
            <div className="container mx-auto px-4">
                <h2 className="mb-10 text-center text-3xl font-bold">
                    Additional Platform Features
                </h2>
                <div className="grid gap-8 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Community Integrations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Connect with fellow digital nomads in Penang
                                through our integrated community features. Join
                                local events, discussions, and networking
                                opportunities.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Local Business Promotions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Discover and support DE Rantau-associated
                                businesses. Enjoy exclusive discounts and
                                promotions tailored for digital nomads in
                                Malaysia.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Resource Hub</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Access a wealth of information about living and
                                working in Malaysia, including guides, tips, and
                                official resources for digital nomads.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
