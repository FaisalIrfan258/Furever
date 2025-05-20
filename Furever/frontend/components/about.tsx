import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function About() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                At Furever, we believe every pet deserves a loving home. Our mission is to connect animals in need with
                caring individuals and families, while supporting shelters and rescue organizations in their vital work.
              </p>
              <div className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600">
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <div className="absolute left-1 top-1 h-5 w-5 text-rose-600 text-xl">•</div>
                    Simplify adoption.
                  </dt>
                  <dd className="inline">
                    {" "}
                    We streamline the pet adoption process, making it easier for shelters to showcase their animals and
                    for adopters to find their perfect match.
                  </dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <div className="absolute left-1 top-1 h-5 w-5 text-rose-600 text-xl">•</div>
                    Reunite lost pets.
                  </dt>
                  <dd className="inline">
                    {" "}
                    Our lost and found system helps reunite lost pets with their families quickly and efficiently.
                  </dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <div className="absolute left-1 top-1 h-5 w-5 text-rose-600 text-xl">•</div>
                    Support rescue efforts.
                  </dt>
                  <dd className="inline">
                    {" "}
                    We coordinate and promote animal rescue operations, mobilizing volunteers and resources where
                    they're needed most.
                  </dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <div className="absolute left-1 top-1 h-5 w-5 text-rose-600 text-xl">•</div>
                    Fund vital work.
                  </dt>
                  <dd className="inline">
                    {" "}
                    Our donation platform ensures that shelters and rescue organizations receive the financial support
                    they need to continue their important work.
                  </dd>
                </div>
              </div>
              <div className="mt-10">
                <Button asChild>
                  <Link href="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
          </div>
          <img
            src="/placeholder.svg?height=1480&width=1442"
            alt="Team working with shelter animals"
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            width={1442}
            height={1480}
          />
        </div>
      </div>
    </section>
  )
}
