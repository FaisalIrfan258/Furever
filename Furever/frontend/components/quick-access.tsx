import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, AlertTriangle, Heart, DollarSign } from "lucide-react"

const features = [
  {
    name: "Find a Pet",
    description: "Browse thousands of pets from shelters and rescues looking for their forever homes.",
    icon: <Search className="h-10 w-10 text-rose-600" />,
    href: "/pets",
    cta: "Browse Pets",
  },
  {
    name: "Lost & Found",
    description: "Report a lost pet or help reunite found pets with their owners.",
    icon: <AlertTriangle className="h-10 w-10 text-amber-500" />,
    href: "/lost-found",
    cta: "Report or Search",
  },
  {
    name: "Rescue Operations",
    description: "Join or support animal rescue operations in your community.",
    icon: <Heart className="h-10 w-10 text-emerald-600" />,
    href: "/rescue",
    cta: "Get Involved",
  },
  {
    name: "Donate",
    description: "Support shelters and rescue organizations with your contribution.",
    icon: <DollarSign className="h-10 w-10 text-blue-600" />,
    href: "/donate",
    cta: "Make a Difference",
  },
]

export default function QuickAccess() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How You Can Help</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            There are many ways to make a difference in the lives of animals in need. Choose how you'd like to get
            involved.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.name} className="h-full">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.name}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={feature.href}>{feature.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
