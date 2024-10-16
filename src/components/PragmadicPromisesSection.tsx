import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function PragmadicPromisesSection() {
  const promises = ['Accommodations', 'Coworking Spaces', 'Community Events']

  return (
    <section className="container mx-auto px-4 py-12 bg-background">
      <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Pragmadic&apos;s Promises</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {promises.map((title, index) => (
          <Card key={index} className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={`/placeholder.svg?height=200&width=300`}
                alt={title}
                width={300}
                height={200}
                className="w-full object-cover rounded-lg"
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Learn More</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
