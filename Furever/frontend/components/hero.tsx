import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <Link href="/about" className="inline-flex space-x-6">
              <span className="rounded-full bg-rose-600/10 px-3 py-1 text-sm font-semibold leading-6 text-rose-600 ring-1 ring-inset ring-rose-600/10">
                Our Mission
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                <span>Learn about what we do</span>
              </span>
            </Link>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Find your <span className="text-rose-600">furever</span> friend
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Connect with shelters, rescue organizations, and pets looking for their forever homes. Our platform makes
            pet adoption simple, transparent, and joyful.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/pets">Find a Pet</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/register">Join as Shelter</Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                src="/placeholder.svg?height=842&width=1152"
                alt="Happy dog with new owner"
                width={1152}
                height={842}
                className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
