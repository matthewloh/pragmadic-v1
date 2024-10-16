import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { FocusCards } from "./aceternity/focus-cards"

export function DeRantauSection() {
  const cards = [
    {
      title: "Coworking Spaces",
      src: "/images/coworking-space.jpg",
    },
    {
      title: "Networking Events",
      src: "/images/networking-event.jpg",
    },
    {
      title: "Local Experiences",
      src: "/images/local-experience.jpg",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-12 bg-background">
      <div className="flex flex-col md:flex-row items-center mb-12">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl font-bold mb-4 text-foreground">We connect you to certified DE Rantau hubs & partners</h2>
          <p className="text-muted-foreground mb-4">
            Discover Penang&apos;s specialized hubs and partners that provide nomad-tailored accommodations and coworking spaces.
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Learn More</Button>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/placeholder.svg?height=300&width=500"
            alt="DE Rantau Hub"
            width={500}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 text-center text-foreground">Explore DE Rantau Offerings</h3>
        <FocusCards cards={cards} />
      </div>
    </section>
  )
}
