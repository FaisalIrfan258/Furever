import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function About() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
          <div className="lg:pr-8 lg:pt-4 order-2 lg:order-1">
            <div className="lg:max-w-lg">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Our Mission</h2>
              <p className="mt-4 sm:mt-6 text-lg leading-8 text-gray-600">
                At Furever, we believe every pet deserves a loving home. Our mission is to connect animals in need with
                caring individuals and families, while supporting shelters and rescue organizations in their vital work.
              </p>
              <div className="mt-6 sm:mt-10 max-w-xl space-y-6 sm:space-y-8 text-base leading-7 text-gray-600">
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
              <div className="mt-8 sm:mt-10">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 mx-auto lg:mx-0">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] lg:max-w-lg xl:h-[550px]">
              <Image
                src="https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1200"
                alt="Team working with shelter animals"
                fill
                className="rounded-xl shadow-xl ring-1 ring-gray-400/10 object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
