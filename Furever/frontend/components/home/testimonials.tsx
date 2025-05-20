import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    id: 1,
    content:
      "Adopting our dog Max through Furever was such a smooth experience. The platform made it easy to find the perfect pet for our family, and the shelter was incredibly helpful throughout the process.",
    author: {
      name: "Sarah Johnson",
      role: "Pet Parent",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150",
      initials: "SJ",
    },
  },
  {
    id: 2,
    content:
      "As a shelter manager, Furever has revolutionized how we connect our animals with potential adopters. The platform's features have helped us increase our adoption rates by over 30%!",
    author: {
      name: "Michael Rodriguez",
      role: "Shelter Manager",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150",
      initials: "MR",
    },
  },
  {
    id: 3,
    content:
      "When our cat went missing, we were devastated. Thanks to Furever's lost and found system, we were reunited with her within 48 hours. I can't express how grateful we are.",
    author: {
      name: "Emily Chen",
      role: "Pet Owner",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150",
      initials: "EC",
    },
  },
]

export default function Testimonials() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Success Stories</h2>
          <p className="mt-4 sm:mt-6 text-lg leading-8 text-gray-600">
            Hear from the people and pets whose lives have been changed through Furever.
          </p>
        </div>
        <div className="mx-auto grid max-w-md grid-cols-1 gap-y-8 gap-x-8 sm:max-w-lg md:max-w-2xl md:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full flex flex-col">
              <CardHeader className="pb-0">
                <div className="flex items-center gap-x-4">
                  <Avatar>
                    <AvatarImage
                      src={testimonial.author.imageUrl || "/placeholder.svg"}
                      alt={testimonial.author.name}
                    />
                    <AvatarFallback>{testimonial.author.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold leading-7 tracking-tight text-gray-900">
                      {testimonial.author.name}
                    </h3>
                    <p className="text-sm leading-6 text-gray-600">{testimonial.author.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 mt-4">
                <p className="text-base italic text-gray-700">&ldquo;{testimonial.content}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
