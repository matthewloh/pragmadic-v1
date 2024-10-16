import Image from 'next/image'
import { Button } from "@/components/ui/button"

export function NomadNetworkSection() {
  return (
    <section className="container mx-auto px-4 py-12 bg-background">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-foreground">Be a part of the nomad network in Penang</h2>
        <p className="text-muted-foreground mb-4">
          Join the many hosted community events and connect with fellow digital nomads in Penang through our generative AI integrated networking support.
        </p>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">View Events</Button>
      </div>
      <Image
        src="/placeholder.svg?height=400&width=800"
        alt="Nomad Network Event"
        width={800}
        height={400}
        className="rounded-lg shadow-lg w-full object-cover"
      />
    </section>
  )
}
